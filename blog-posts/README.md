# Custom Blog System Guide

Welcome to your new custom blog! Here's how to use it:

## File Structure
```
anna-xu.github.io/
├── blog.html                    # Main blog index page
├── blog-posts/                  # All your blog posts
│   ├── welcome.html            # Your first post
│   ├── template.html           # Template for new posts
│   └── README.md              # This guide
└── subpage-style.css           # Contains all the blog styling
```

## Adding a New Blog Post

### Step 1: Create the Post File
1. Copy `blog-posts/template.html`
2. Rename it to something descriptive (e.g., `my-research-journey.html`)
3. Edit the new file and replace:
   - `POST_TITLE` with your actual title
   - `POST_DATE` with the date (e.g., "January 15, 2025")
   - `TAG1`, `TAG2` with relevant tags
   - Update the `<title>` tag in the `<head>` section
   - Write your content in the `blog-post-content` div

### Step 2: Add to Blog Index
1. Open `blog.html`
2. Add a new blog post card at the top of the `blog-posts` div
3. Follow this format:
```html
<article class="blog-post-card">
  <div class="post-meta">
    <span class="post-date">Your Date</span>
    <div class="post-tags">
      <span class="post-tag">Tag1</span>
      <span class="post-tag">Tag2</span>
    </div>
  </div>
  <h2><a href="blog-posts/your-file-name.html">Your Post Title</a></h2>
  <p class="post-excerpt">Brief description of your post...</p>
  <div class="post-footer">
    <a href="blog-posts/your-file-name.html" class="read-more">Read more →</a>
    <span class="read-time">X min read</span>
  </div>
</article>
```

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Consistent Styling**: Matches your main site's dark theme with lavender accents
- **Easy Navigation**: Integrated sidebar navigation
- **Hover Effects**: Beautiful interactions and animations
- **SEO-Friendly**: Proper meta tags and semantic HTML

## Customization

All the blog styling is in `subpage-style.css` under the "Blog Page Styles" and "Individual Blog Post Styles" sections. You can:

- Change colors by modifying the CSS variables
- Adjust layout by editing the grid and flexbox properties
- Add new post types by creating additional templates
- Modify the typography by changing the font-family declarations

## Tips

1. **Keep posts organized**: Use descriptive filenames for your posts
2. **Consistent tagging**: Develop a tagging system for easy categorization
3. **Read time estimation**: Roughly 200-250 words per minute for reading time
4. **Test before publishing**: Always check your post in a browser before adding to the index

## Future Enhancements

You could add:
- Search functionality
- Tag filtering on the blog index
- RSS feed generation
- Comments system
- Social sharing buttons
- Reading progress indicator

Enjoy your new blog! 🎉 