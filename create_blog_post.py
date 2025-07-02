#!/usr/bin/env python3
"""
Blog Post Generator
Converts markdown files to HTML blog posts for website

Usage:
    # Default: Creates HTML in blog-posts/ directory
    python3 create_blog_post.py create my-post.md

    # Create and publish post (recommended!)
    python3 create_blog_post.py create my-post.md -u

    # Specify different output directory
    python3 create_blog_post.py create my-post.md
    
    # Specify exact output path and filename
    python3 create_blog_post.py create my-post.md --output-path articles/research-update.html

    # Delete a blog post
    python3 create_blog_post.py delete my-post.html

    # Get help
    python3 create_blog_post.py --help

    # Update a blog post
    python3 create_blog_post.py update examplepost.md
"""

import re
import os
import sys
from datetime import datetime
import argparse

def markdown_to_html(markdown_text):
    """Convert basic markdown to HTML"""
    html = markdown_text
    
    # Handle multi-line code blocks FIRST (triple backticks)
    # This regex matches ``` followed by optional language, newline, content, newline, ```
    html = re.sub(r'```[\w]*\n(.*?)\n```', r'<pre><code>\1</code></pre>', html, flags=re.DOTALL)
    
    # Headers
    html = re.sub(r'^### (.*$)', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*$)', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.*$)', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    
    # Bold and italic
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
    
    # Links
    html = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', html)
    
    # Single backticks (inline code) - do this AFTER multi-line code blocks
    html = re.sub(r'`([^`]+)`', r'<code>\1</code>', html)
    
    # Lists
    lines = html.split('\n')
    in_list = False
    in_code_block = False
    result_lines = []
    
    for line in lines:
        # Skip processing if we're inside a code block
        if '<pre><code>' in line:
            in_code_block = True
            result_lines.append(line)
            continue
        elif '</code></pre>' in line:
            in_code_block = False
            result_lines.append(line)
            continue
        elif in_code_block:
            result_lines.append(line)
            continue
            
        if line.strip().startswith('- '):
            if not in_list:
                result_lines.append('<ul>')
                in_list = True
            content = line.strip()[2:]  # Remove "- "
            result_lines.append(f'<li>{content}</li>')
        else:
            if in_list:
                result_lines.append('</ul>')
                in_list = False
            
            # Convert paragraphs (non-empty lines that aren't headers or lists)
            if line.strip() and not line.strip().startswith('<'):
                result_lines.append(f'<p>{line.strip()}</p>')
            else:
                result_lines.append(line)
    
    if in_list:
        result_lines.append('</ul>')
    
    return '\n'.join(result_lines)

def extract_frontmatter(content):
    """Extract frontmatter from markdown file"""
    if content.startswith('---\n'):
        parts = content.split('---\n', 2)
        if len(parts) >= 3:
            frontmatter = {}
            for line in parts[1].strip().split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    frontmatter[key.strip()] = value.strip().strip('"\'')
            return frontmatter, parts[2]
    
    return {}, content

def create_blog_post(markdown_file, output_dir="blog-posts"):
    """Convert markdown file to HTML blog post"""
    
    if not os.path.exists(markdown_file):
        print(f"Error: {markdown_file} not found")
        return None, None
    
    with open(markdown_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract frontmatter and content
    frontmatter, markdown_content = extract_frontmatter(content)
    
    # Get metadata
    title = frontmatter.get('title', 'Untitled Post')
    date = frontmatter.get('date', datetime.now().strftime('%B %d, %Y'))
    tags = frontmatter.get('tags', '').split(',') if frontmatter.get('tags') else ['Blog']
    
    # Convert markdown to HTML
    html_content = markdown_to_html(markdown_content.strip())
    
    # Create filename
    base_name = os.path.splitext(os.path.basename(markdown_file))[0]
    html_filename = f"{base_name}.html"
    html_path = os.path.join(output_dir, html_filename)
    
    # Generate tags HTML
    tags_html = '\n            '.join([f'<span class="post-tag">{tag.strip()}</span>' for tag in tags])
    
    # HTML template for regular blog post creation
    html_template = f"""<html>
<link rel="stylesheet" href="../subpage-style.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<title>{title} - Anna Xu</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<body class="blog-post-page">
<div class="container">
  <!-- Sidebar Navigation -->
  <nav class="sidebar">
    <div class="sidebar-header">
      <h1><a href="../index.html" style="color: white; text-decoration: none;">A N N A · X U</a></h1>
    </div>
    
           <div class="nav-section">
      <h3>Pages</h3>
      <ul class="nav-links">
        <li><a href="../about.html"><i class="fa fa-user"></i> About</a></li>
        <li><a href="../research.html"><i class="fa fa-search"></i> Research</a></li>
        <li><a href="../datacode.html"><i class="fa fa-code"></i> Code+Data</a></li>
        <li><a href="../blog.html" class="active"><i class="fa fa-edit"></i> Blog</a></li>
      </ul>
    </div>
    
    <div class="nav-section">
      <h3>External</h3>
      <ul class="nav-links">
        <li><a href="../timer/index.html"><i class="fa fa-clock-o"></i> Timer</a></li>
        <li><a href="https://www.linkedin.com/in/anna-xu-257317275/" target="_blank"><i class="fa fa-linkedin"></i> LinkedIn</a></li>
        <li><a href="https://github.com/anna-xu" target="_blank"><i class="fa fa-github"></i> GitHub</a></li>
      </ul>
    </div>
  </nav>

  <!-- Main Content Area -->
  <main class="main-content">
    <article class="blog-post">
      <div class="blog-post-content">
        <div class="post-meta">
          <span class="post-date">{date}</span>
          <div class="post-tags">
            {tags_html}
          </div>
        </div>
        <h1>{title}</h1>
        
        {html_content}
      </div>
    </article>

    <div class="post-navigation">
      <a href="../blog.html" class="back-to-blog">← Back to Blog</a>
    </div>
  </main>
</div>

<footer>🐈 Website by Anna Xu · <a href="https://github.com/anna-xu/anna-xu.github.io">Click here for site code</a></footer>

</body>
</html>"""

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Write HTML file
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_template)
    
    print(f"✅ Created blog post: {html_path}")
    print(f"📝 Title: {title}")
    print(f"📅 Date: {date}")
    print(f"🏷️  Tags: {', '.join(tags)}")
    print(f"\n💡 Next steps:")
    print(f"1. Review the generated HTML file")
    print(f"2. Add the post to blog.html (see instructions below)")
    print(f"\n📋 Add this to blog.html in the blog-posts div:")
    
    # Generate blog index entry
    excerpt = html_content[:200] + "..." if len(html_content) > 200 else html_content
    excerpt = re.sub(r'<[^>]+>', '', excerpt)  # Remove HTML tags for excerpt
    
    blog_entry = f"""
      <article class="blog-post-card">
        <div class="post-meta">
          <span class="post-date">{date}</span>
          <div class="post-tags">
            {tags_html}
          </div>
        </div>
        <h2><a href="blog-posts/{html_filename}">{title}</a></h2>
        <p class="post-excerpt">{excerpt}</p>
        <div class="post-footer">
          <a href="blog-posts/{html_filename}" class="read-more">Read more →</a>
          <span class="read-time">3 min read</span>
        </div>
      </article>"""
    
    print(blog_entry)
    
    return blog_entry, html_filename

def update_blog_html(blog_entry, title, date):
    """Automatically add blog post entry to blog.html"""
    blog_html_path = "blog.html"
    
    if not os.path.exists(blog_html_path):
        print(f"❌ Error: {blog_html_path} not found")
        return False
    
    # Read the current blog.html
    with open(blog_html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the insertion point (after <div class="blog-posts">)
    insertion_marker = '<div class="blog-posts">'
    insertion_index = content.find(insertion_marker)
    
    if insertion_index == -1:
        print(f"❌ Error: Could not find blog-posts div in {blog_html_path}")
        return False
    
    # Find the end of the opening tag
    insertion_point = content.find('\n', insertion_index) + 1
    
    # Insert the new blog entry (with proper indentation)
    indented_entry = '\n'.join(['      ' + line if line.strip() else line for line in blog_entry.strip().split('\n')])
    new_content = (
        content[:insertion_point] + 
        '\n' + indented_entry + '\n' +
        content[insertion_point:]
    )
    
    # Write back to blog.html
    with open(blog_html_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Updated blog.html with new post: {title}")
    return True

def remove_blog_entry(post_filename):
    """Remove a blog post entry from blog.html without deleting the HTML file"""
    
    # Remove .html extension if provided
    if post_filename.endswith('.html'):
        post_filename = post_filename[:-5]
    
    blog_html_path = "blog.html"
    
    # Check if blog.html exists
    if not os.path.exists(blog_html_path):
        print(f"❌ Error: {blog_html_path} not found")
        return False
    
    # Read blog.html
    with open(blog_html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and remove the blog post entry
    # Look for the link pattern to this specific post
    link_pattern = f'href="blog-posts/{post_filename}.html"'
    
    # Find the start of the article containing this link
    link_index = content.find(link_pattern)
    if link_index == -1:
        print(f"⚠️  Warning: Could not find blog entry for {post_filename} in blog.html")
        return False
    
    # Find the article start (search backwards)
    article_start = content.rfind('<article class="blog-post-card">', 0, link_index)
    if article_start == -1:
        print(f"❌ Error: Could not find article start for {post_filename}")
        return False
    
    # Find the article end (search forwards)
    article_end = content.find('</article>', link_index)
    if article_end == -1:
        print(f"❌ Error: Could not find article end for {post_filename}")
        return False
    
    article_end += len('</article>')
    
    # Remove the entire article block (including any whitespace before/after)
    # Look for newlines to clean up formatting
    while article_start > 0 and content[article_start - 1] in ' \t':
        article_start -= 1
    if article_start > 0 and content[article_start - 1] == '\n':
        article_start -= 1
        
    while article_end < len(content) and content[article_end] in ' \t\n':
        article_end += 1
    
    # Remove the article from content
    new_content = content[:article_start] + content[article_end:]
    
    # Write back to blog.html
    with open(blog_html_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Removed old blog entry from blog.html")
    return True

def delete_blog_post(post_filename):
    """Delete a blog post and remove it from blog.html"""
    
    # Remove .html extension if provided
    if post_filename.endswith('.html'):
        post_filename = post_filename[:-5]
    
    html_path = f"blog-posts/{post_filename}.html"
    blog_html_path = "blog.html"
    
    # Check if HTML file exists
    if not os.path.exists(html_path):
        print(f"❌ Error: {html_path} not found")
        return False
    
    # Check if blog.html exists
    if not os.path.exists(blog_html_path):
        print(f"❌ Error: {blog_html_path} not found")
        return False
    
    # Read blog.html
    with open(blog_html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and remove the blog post entry
    # Look for the link pattern to this specific post
    link_pattern = f'href="blog-posts/{post_filename}.html"'
    
    # Find the start of the article containing this link
    link_index = content.find(link_pattern)
    if link_index == -1:
        print(f"❌ Warning: Could not find blog entry for {post_filename} in blog.html")
        print(f"🗑️  Deleting HTML file only...")
    else:
        # Find the article start (search backwards)
        article_start = content.rfind('<article class="blog-post-card">', 0, link_index)
        if article_start == -1:
            print(f"❌ Error: Could not find article start for {post_filename}")
            return False
        
        # Find the article end (search forwards)
        article_end = content.find('</article>', link_index)
        if article_end == -1:
            print(f"❌ Error: Could not find article end for {post_filename}")
            return False
        
        article_end += len('</article>')
        
        # Remove the entire article block (including any whitespace before/after)
        # Look for newlines to clean up formatting
        while article_start > 0 and content[article_start - 1] in ' \t':
            article_start -= 1
        if article_start > 0 and content[article_start - 1] == '\n':
            article_start -= 1
            
        while article_end < len(content) and content[article_end] in ' \t\n':
            article_end += 1
        
        # Remove the article from content
        new_content = content[:article_start] + content[article_end:]
        
        # Write back to blog.html
        with open(blog_html_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Removed blog entry from blog.html")
    
    # Delete the HTML file
    os.remove(html_path)
    print(f"✅ Deleted {html_path}")
    
    print(f"🗑️  Successfully deleted blog post: {post_filename}")
    return True

def create_blog_post_custom(markdown_file, output_dir, custom_name):
    """Convert markdown file to HTML blog post with custom filename"""
    
    if not os.path.exists(markdown_file):
        print(f"Error: {markdown_file} not found")
        return None, None
    
    with open(markdown_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract frontmatter and content
    frontmatter, markdown_content = extract_frontmatter(content)
    
    # Get metadata
    title = frontmatter.get('title', 'Untitled Post')
    date = frontmatter.get('date', datetime.now().strftime('%B %d, %Y'))
    tags = frontmatter.get('tags', '').split(',') if frontmatter.get('tags') else ['Blog']
    
    # Convert markdown to HTML
    html_content = markdown_to_html(markdown_content.strip())
    
    # Use custom filename
    html_filename = f"{custom_name}.html"
    html_path = os.path.join(output_dir, html_filename)
    
    # Generate tags HTML
    tags_html = '\n            '.join([f'<span class="post-tag">{tag.strip()}</span>' for tag in tags])
    
    # HTML template (same as original)
    html_template = f"""<html>
<link rel="stylesheet" href="../subpage-style.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<title>{title} - Anna Xu</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<body class="blog-post-page">
<div class="container">
  <!-- Sidebar Navigation -->
  <nav class="sidebar">
    <div class="sidebar-header">
      <h1><a href="../index.html" style="color: white; text-decoration: none;">A N N A · X U</a></h1>
    </div>
    
        <div class="nav-section">
      <h3>Pages</h3>
      <ul class="nav-links">
        <li><a href="../about.html"><i class="fa fa-user"></i> About</a></li>
        <li><a href="../research.html"><i class="fa fa-search"></i> Research</a></li>
        <li><a href="../datacode.html"><i class="fa fa-code"></i> Code+Data</a></li>
        <li><a href="../blog.html" class="active"><i class="fa fa-edit"></i> Blog</a></li>
      </ul>
    </div>
    
    <div class="nav-section">
      <h3>External</h3>
      <ul class="nav-links">
        <li><a href="../timer/index.html"><i class="fa fa-clock-o"></i> Timer</a></li>
        <li><a href="https://www.linkedin.com/in/anna-xu-257317275/" target="_blank"><i class="fa fa-linkedin"></i> LinkedIn</a></li>
        <li><a href="https://github.com/anna-xu" target="_blank"><i class="fa fa-github"></i> GitHub</a></li>
      </ul>
    </div>
  </nav>

  <!-- Main Content Area -->
  <main class="main-content">
    <article class="blog-post">
      <div class="blog-post-content">
        <div class="post-meta">
          <span class="post-date">{date}</span>
          <div class="post-tags">
            {tags_html}
          </div>
        </div>
        <h1>{title}</h1>
        
        {html_content}
      </div>
    </article>

    <div class="post-navigation">
      <a href="../blog.html" class="back-to-blog">← Back to Blog</a>
    </div>
  </main>
</div>

<footer>🐈 Website by Anna Xu · <a href="https://github.com/anna-xu/anna-xu.github.io">Click here for site code</a></footer>

</body>
</html>"""

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Write HTML file
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_template)
    
    print(f"✅ Created blog post: {html_path}")
    print(f"📝 Title: {title}")
    print(f"📅 Date: {date}")
    print(f"🏷️  Tags: {', '.join(tags)}")
    print(f"\n💡 Next steps:")
    print(f"1. Review the generated HTML file")
    print(f"2. Add the post to blog.html (see instructions below)")
    print(f"\n📋 Add this to blog.html in the blog-posts div:")
    
    # Generate blog index entry
    excerpt = html_content[:200] + "..." if len(html_content) > 200 else html_content
    excerpt = re.sub(r'<[^>]+>', '', excerpt)  # Remove HTML tags for excerpt
    
    # Determine relative path for blog.html link
    if output_dir == 'blog-posts':
        link_path = f"blog-posts/{html_filename}"
    else:
        link_path = html_path
    
    blog_entry = f"""
      <article class="blog-post-card">
        <div class="post-meta">
          <span class="post-date">{date}</span>
          <div class="post-tags">
            {tags_html}
          </div>
        </div>
        <h2><a href="{link_path}">{title}</a></h2>
        <p class="post-excerpt">{excerpt}</p>
        <div class="post-footer">
          <a href="{link_path}" class="read-more">Read more →</a>
          <span class="read-time">3 min read</span>
        </div>
      </article>"""
    
    print(blog_entry)
    
    return blog_entry, html_filename

def update_blog_post(markdown_file, output_dir="blog-posts"):
    """Update an existing blog post by regenerating HTML from markdown"""
    
    if not os.path.exists(markdown_file):
        print(f"❌ Error: {markdown_file} not found")
        return None, None
    
    # Get the expected HTML filename
    base_name = os.path.splitext(os.path.basename(markdown_file))[0]
    html_filename = f"{base_name}.html"
    html_path = os.path.join(output_dir, html_filename)
    
    # Check if HTML file exists
    if not os.path.exists(html_path):
        print(f"❌ Error: {html_path} not found. Use 'create' command instead.")
        print(f"💡 The HTML file doesn't exist yet. Run: python3 create_blog_post.py create {markdown_file}")
        return None, None
    
    print(f"🔄 Updating existing blog post: {html_path}")
    
    # First, remove the old entry from blog.html (but keep the HTML file)
    remove_blog_entry(base_name)
    
    # Use the same create logic but for existing file
    blog_entry, filename = create_blog_post(markdown_file, output_dir)
    
    # Extract metadata for blog.html update
    with open(markdown_file, 'r', encoding='utf-8') as f:
        content = f.read()
    frontmatter, _ = extract_frontmatter(content)
    title = frontmatter.get('title', 'Untitled Post')
    date = frontmatter.get('date', datetime.now().strftime('%B %d, %Y'))
    
    # Update blog.html with the new entry
    if blog_entry:
        update_blog_html(blog_entry, title, date)
    
    print(f"✅ Updated blog post: {html_path}")
    print(f"✅ Updated blog.html with new content")
    print(f"💡 The HTML file and blog index have been updated from the markdown.")
    
    return blog_entry, filename

def main():
    parser = argparse.ArgumentParser(description='Manage blog posts - create, update, or delete')
    
    # Create subcommands
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Create post command
    create_parser = subparsers.add_parser('create', help='Create a new blog post')
    create_parser.add_argument('markdown_file', help='Path to markdown file')
    create_parser.add_argument('-o', '--output-dir', default='blog-posts', 
                              help='Output directory for HTML files (default: blog-posts)')
    create_parser.add_argument('--output-path', 
                              help='Full output path including filename (overrides --output-dir)')
    create_parser.add_argument('-u', '--update-blog', action='store_true',
                              help='Automatically update blog.html with the new post')
    
    # Update post command
    update_parser = subparsers.add_parser('update', help='Update an existing blog post from markdown')
    update_parser.add_argument('markdown_file', help='Path to markdown file')
    update_parser.add_argument('-o', '--output-dir', default='blog-posts', 
                              help='Output directory for HTML files (default: blog-posts)')
    
    # Delete post command
    delete_parser = subparsers.add_parser('delete', help='Delete a blog post')
    delete_parser.add_argument('post_filename', help='Blog post filename (without .html extension)')
    
    # For backwards compatibility, also support the old syntax without subcommands
    parser.add_argument('markdown_file_legacy', nargs='?', help=argparse.SUPPRESS)
    parser.add_argument('-o', '--output-dir', default='blog-posts', 
                       help='Output directory for HTML files (default: blog-posts)')
    parser.add_argument('--output-path', 
                       help='Full output path including filename (overrides --output-dir)')
    parser.add_argument('-u', '--update-blog', action='store_true',
                       help='Automatically update blog.html with the new post')
    parser.add_argument('-d', '--delete', metavar='POST_FILENAME',
                       help='Delete a blog post (filename without .html)')
    
    args = parser.parse_args()
    
    # Handle delete flag (backwards compatibility)
    if args.delete:
        delete_blog_post(args.delete)
        return
    
    # Handle subcommands
    if args.command == 'delete':
        delete_blog_post(args.post_filename)
        return
    elif args.command == 'update':
        update_blog_post(args.markdown_file, args.output_dir)
        return
    elif args.command == 'create':
        markdown_file = args.markdown_file
    elif args.markdown_file_legacy:
        # Backwards compatibility - old syntax
        markdown_file = args.markdown_file_legacy
    else:
        parser.print_help()
        return
    
    # Create blog post
    if args.output_path:
        # User specified full path
        output_dir = os.path.dirname(args.output_path)
        base_name = os.path.splitext(os.path.basename(args.output_path))[0]
        blog_entry, html_filename = create_blog_post_custom(markdown_file, output_dir, base_name)
    else:
        # Use directory and auto-generate filename
        blog_entry, html_filename = create_blog_post(markdown_file, args.output_dir)
    
    # Auto-update blog.html if requested
    if args.update_blog and blog_entry is not None:
        # Need to extract title from the markdown file
        with open(markdown_file, 'r', encoding='utf-8') as f:
            content = f.read()
        frontmatter, _ = extract_frontmatter(content)
        title = frontmatter.get('title', 'Untitled Post')
        date = frontmatter.get('date', datetime.now().strftime('%B %d, %Y'))
        
        update_blog_html(blog_entry, title, date)

if __name__ == '__main__':
    main()