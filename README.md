## So you think you can post?

1. Clone or fork whole repo. 
2. Make branch with your post title: e.g. `git checkout -b mySuperCoolPost`
3. Open RStudio and make sure your current working directory is the blog repo (you can create a .Rproj in the directory and click on that to open RStudio to ensure this). 
4. Run `blogdown::serve_site()` to make sure everything looks good.
5. To add a post, run `blogdown::new_post(title = "Add your title here", rmd=TRUE)` 
The yaml at the top of your post should include:
```
---
author: "Your Name"
date: 2016-12-24T15:50:12-06:00
excerpt: "This is a summary of your post"
title: "Add your title here"
---
```
6. Once everything looks good submit a PR to the master branch of the main repo. 
7. Revel in the ones of twitter followers your new post gains you!
