#!/usr/bin/env python3
"""
Usage: python add_post.py blog/my-post.md

Reads a markdown file from the blog/ folder, extracts the title, URL, and
first n characters of the post body, then:
  1. Prepends a new <article> entry to blog.html
  2. Creates a new HTML file named <URL>.html for the full post
"""

import sys
import re
import os
from datetime import date

# ── helpers ──────────────────────────────────────────────────────────────────

summary_length = 200

def parse_markdown(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        raw = f.read()

    # Extract frontmatter between the first pair of ---
    fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", raw, re.DOTALL)
    if not fm_match:
        sys.exit("Error: could not find frontmatter (--- block) in the markdown file.")

    frontmatter = fm_match.group(1)
    body = fm_match.group(2).strip()

    title_match = re.search(r"^Title:\s*(.+)$", frontmatter, re.MULTILINE)
    url_match   = re.search(r"^URL:\s*(.+)$",   frontmatter, re.MULTILINE)

    if not title_match:
        sys.exit("Error: 'Title:' not found in frontmatter.")
    if not url_match:
        sys.exit("Error: 'URL:' not found in frontmatter.")

    title = title_match.group(1).strip()
    url   = url_match.group(1).strip()

    # Strip markdown syntax for a clean excerpt
    clean_body = re.sub(r"!\[.*?\]\(.*?\)", "", body)   # image links first
    clean_body = re.sub(r"[#*_`>\[\]]", "", clean_body) # other markdown chars (! preserved)
    clean_body = re.sub(r"\(http\S+\)", "", clean_body)
    clean_body = re.sub(r"\s+", " ", clean_body).strip()
    excerpt = clean_body[:summary_length].rstrip() + (" <a href="+f"{url}.html"+"><font size=3>...</font></a>" if len(clean_body) > summary_length else "")
    return title, url, excerpt, body


def make_article_html(title, url, excerpt, post_date):
    return (
        f'  <article class="post">\n'
        f'    <div class="post-date">{post_date}</div>\n'
        f'    <div class="post-title"><a href="{url}.html">{title}</a></div>\n'
        f'    <p class="post-excerpt">{excerpt}</p>\n'
        f'  </article>\n'
    )


def update_blog_html(article_html, blog_path="blog.html"):
    with open(blog_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Insert before the first existing <article> (or before </main> if none)
    if '<article' in content:
        insert_before = content.index('<article')
    elif '</main>' in content:
        insert_before = content.index('</main>')
    else:
        sys.exit("Error: could not find <article> or </main> in blog.html.")

    updated = content[:insert_before] + article_html + "\n" + content[insert_before:]

    with open(blog_path, "w", encoding="utf-8") as f:
        f.write(updated)

    print(f"✓ Added entry to {blog_path}")


def create_post_html(title, url, body, post_date):
    # Convert minimal markdown to HTML for the post body
    html_body = body

    # Code blocks
    html_body = re.sub(r"```.*?\n(.*?)```", lambda m: f"<pre><code>{m.group(1)}</code></pre>", html_body, flags=re.DOTALL)

    # Headings
    html_body = re.sub(r"^### (.+)$", r"<h3>\1</h3>", html_body, flags=re.MULTILINE)
    html_body = re.sub(r"^## (.+)$",  r"<h2>\1</h2>", html_body, flags=re.MULTILINE)
    html_body = re.sub(r"^# (.+)$",   r"<h1>\1</h1>", html_body, flags=re.MULTILINE)

    # Bold / italic
    html_body = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", html_body)
    html_body = re.sub(r"\*(.+?)\*",     r"<em>\1</em>",         html_body)

    # Links
    html_body = re.sub(r"\[(.+?)\]\((.+?)\)", r'<a href="\2">\1</a>', html_body)

    # Paragraphs: wrap non-tag lines
    lines = html_body.split("\n")
    result = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            result.append("")
        elif stripped.startswith("<"):
            result.append(stripped)
        else:
            result.append(f"<p>{stripped}</p>")
    html_body = "\n".join(result)

    post_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AX</title>
  <link rel="stylesheet" href="subpage-style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    header {{ margin-bottom: 3.5rem; }}
    h1 em {{ color: #d94b4b; }}
    .post-header {{ padding: 2rem 0 1.5rem; border-bottom: 1px dashed #d94b4b; margin-bottom: 2rem; }}
    .post-date {{ font-size: 0.75rem; color: #9a9a93; margin-bottom: 0.5rem; }}
    .post-title {{
      font-family: 'Georgia', serif;
      font-size: 1.8rem;
      font-weight: 400;
      line-height: 1.25;
      letter-spacing: -0.02em;
    }}
    .post-body p {{ font-size: 0.95rem; font-weight: 300; color: #F8EDED; line-height: 1.8; margin-bottom: 1.2rem; }}
    .post-body h2 {{ font-family: 'Georgia', serif; font-size: 1.3rem; font-weight: 400; margin: 2rem 0 0.75rem; }}
    .post-body h3 {{ font-size: 1rem; font-weight: 400; margin: 1.5rem 0 0.5rem; color: #9a9a93; }}
    .post-body pre {{ background: #1e1e1e; padding: 1rem; border-radius: 4px; overflow-x: auto; margin-bottom: 1.2rem; }}
    .post-body code {{ font-family: monospace; font-size: 0.85rem; color: #f8f8f2; }}
    .post-body a {{ color: #FF7F11; }}
    .post-body a:hover {{ color: #ACBFA4; }}
    .back-link {{ display: inline-block; margin-top: 2.5rem; font-size: 0.8rem; color: #9a9a93; text-decoration: none; }}
    .back-link:hover {{ color: #FF7F11; }}
  </style>
</head>
<body>

<button class="hamburger" onclick="toggleSidebar()">&#9776;</button>
<div class="overlay" id="overlay" onclick="toggleSidebar()"></div>

<nav class="sidebar" id="sidebar">
  <div class="sidebar-nav">
  <div class="sidebar-title"><a href="index.html">AX</a></div>
    <a href="about.html">About</a>
    <a href="datacode.html">Code+Data</a>
    <a href="blog.html">Blog</a>
  </div>
  <div class="sidebar-nav-footer">🐈 <a href="https://github.com/anna-xu/anna-xu.github.io"><u>Site Code</u></a></div>
</nav>

<main>
  <div class="post-header">
    <div class="post-date">{post_date}</div>
    <div class="post-title">{title}</div>
  </div>
  <div class="post-body">
{html_body}
  </div>
  <a class="back-link" href="blog.html">← Back to blog</a>
</main>
</body>

<script>
  function toggleSidebar() {{
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  }}
</script>


</html>
"""
    filename = f"{url}.html"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(post_html)
    print(f"✓ Created post page: {filename}")


# ── main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("Usage: python add_post.py blog/your-post.md")

    md_path = sys.argv[1]
    if not os.path.exists(md_path):
        sys.exit(f"Error: file not found: {md_path}")

    title, url, excerpt, body = parse_markdown(md_path)
    post_date = date.today().strftime("%b %-d, %Y")   # e.g. "May 5, 2026"

    update_blog_html(make_article_html(title, url, excerpt, post_date))
    create_post_html(title, url, body, post_date)