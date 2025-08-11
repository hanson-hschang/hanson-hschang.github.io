+++
title = 'Learn to code a website from scratch'
date = 2022-08-04
updated = 2023-03-15
in_search_index = true
draft = false
[taxonomies]
tags = ['website', 'programming']
categories = ['blogs', 'miscellanea']
[extra]
excerpt = "Before you really start getting into this post, let me phrase it this way. Don't do it. There are actually a lot of alternatives to building a website including Google site, Wix, Weebly, etc, and none of those requires any knowledge of coding. Most importantly, they all have nice and pretty templates for any kind of use you want. So, before you proceed to the following reading, make sure you have checked those web-design platforms and see if you could find the template you like."
+++

> Before you really start getting into this post, let me phrase it this way. 
> 
> Don't do it.

There are actually a lot of alternatives to building a website including Google site, Wix, Weebly, etc, and none of those requires any knowledge of coding. 
Most importantly, they all have nice and pretty templates for any kind of use you want. 
So, before you proceed to the following reading, make sure you have checked those web-design platforms and see if you could find the template you like.

If you have really gone through those tools mentioned above and still can not find the thing you want or just merely want to build a website from scratch like me. 
This is a documentation of how I learned to code a website from the beginner level. 
Here, a few video links will be presented in a recommended learning order so that people can learn to code their websites comfortably. 
(At least, I think it is comfortable for me >.<)

## What is needed to code a website

[This one-hour crash course](https://youtu.be/qz0aGYrrlhU) made by Mosh gives an idea of what languages and packages are commonly used and needed for setting up a website. In summary, coding up a website is like building up a house, and each language or tool has its different job:


1. **HTML** is like the structural elements of the website (*presentation*)

    (like buildings have doors, columns, elevators, etc.)

2. **CSS** is like the appearance of each element on the website (*styling*)

    (like the colors of doors, the heights of columns, and the sizes of elevators)

3. **JavaScript** is like the action of different elements (*functionality*)

    (like when you ring the doorbell and a message is sent to the house owner; or like when you push a button and an elevator comes to your floor)

4. **React** is one of the useful libraries (*building tools*) that is commonly used in the field of web-developer.

Fig. 1 shows the learning flow and timeline. However, the timeline should vary from person to person. 
Take your time to understand each language and learn at your pace. =D

{{ image(path="img/learning-flow.png", width=700, alt="Learning Flow. This illustrates what the learning process and order should be like. If you are building your own website, Git might not be very important for you at the beginning. However, if you are working on a project, then the version control tool Git is very important and useful.") }}

## HTML (HyperText Markup Language)

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Contains metadata/information for the document -->
    ...
  </head>
  <body>
    <!-- Defines the document's body -->
    ...
  </body>
</html>
```

Most HTML files (HTML5 to be specific) are in the presented form as above which includes the two most important tags: `head` and `body`. 
The rest of the HTML tags can be found on [this page](https://www.w3schools.com/TAgs/default.asp) from W3Schools. 
However, the most commonly used ones can be learned in [this little bit lengthy video](https://youtu.be/UB1O30fR-EE) by Traversy Media. 
Inside the body tag, one important thing to writing a clean code is to do it in the format of Semantic HTML (Fig. 2), which I find very important and is clearly and cleanly explained in [this concise video](https://youtu.be/wu6PPRKcT8Y) by Ethan Eisenhard.

{{ image(path="img/semantic-html.png", width=700, alt="Semantic HTML. Code in the right way; not the left way. However, it is definitely ok to do the left way when you are just trying something or just getting started with HTML programming.") }}

## CSS (Cascading Style Sheets)

{{ image(path="img/box-model.png", width=700, alt="Box model. I believe it is easier for any developer to have this box model in mind when they are using CSS to decorate their website. It cleanly separates each element brick by brick and gives a clear picture of each element's size, position, and color layout.") }}

It is probably one of the most painful languages for web developers to learn CSS since it is more like a design thing rather than a formal language I think. 
Some people even think that CSS is a broken and chaotic language and it is too damn hard ><. However, a few essential and useful ideas are conveyed in [this very very long video](https://www.youtube.com/watch?v=yfoY53QXEnI) by Traversy Media. 
(Don't get lost in between. 
One may use 1.5x or even 2.0x speed to go through the concepts and leave the detail behind. 
You will need to Google the detailed syntax again anyway when you are using it.) 
Essentially, one nice thing to have in mind, when you are coding in CSS, is the box model (Fig. 3), which together with other tips is well explained in [this video](https://youtu.be/Qhaz36TZG5Y) by Fireship. 
BTW, they also have pro tips for other languages in their channel. 
Lastly, when you make it here, you shall be able to complete the following sample website (Fig. 4). 
Give it a try!

{{ image(path="img/sample-website.png", width=700, alt="Sample website. Till now, you should be able to build a simple website like this using only HTML and CSS. If one has any problem with this, check out [here](https://youtu.be/yfoY53QXEnI?t=4164), and you'll find the sample code in the description and explanation from that starting time.") }}

If you are only looking for designing your own personal website. 
These two languages might be enough for you. 
What you need to do is to find a good library and a good template, and then Bob's your uncle! 
If you want to do more than a static website like having a database that includes your goods, and you want to make a selling website or building a dynamic website that lists down your undone tasks on the calendar. 
The next thing you will need to learn is the programming language: Javascript.

## JavaScript & React JS

JavaScript is a scripting language that works on both browsers and servers. 
Here, we mainly focus on the front-end which is the browser part. 
It enables you to create dynamically updating elements, control multimedia, animate images, and a lot of other things else. [This not-too-short video](https://youtu.be/W6NZfCO5SIk) made by Mosh gives a basic intro background of Javascript and [this other also not-too-short video](https://youtu.be/hdI2bqOjy3c) from Traversy Media provides an illustrative way of explaining how it controls element behaviors in the website. 
React JS, on the other hand, is a useful JavaScript library for building user interfaces (Fig. 5). 
Once you have understood the basics of JavaScript from the previous two videos, [this crash course](https://youtu.be/w7ejDZ8SWv8) from Traversy Media should be easy for you to follow. 
Frameworks other than React (made by Facebook) include [Angular](https://youtu.be/3dHNOWTI7H8) (made by Google) and [Vue](https://youtu.be/qZXt1Aom3Cs). 
Pick one to start with, and it is easy to understand the others if needed.

{{ image(path="img/react-js.png", width=700, alt="React JS. It is a framework for building up a website. You may define elements like header, button, checkbox, etc in a dynamic way (including animation) and also exchange info from and to databases.") }}

## Summary

### Quick Recap

Till now, you should have a basic understanding of how HTML, CSS, and JavaScript work. 
However, to build a nice website, it is very important to use tools that other developers have already put their efforts into so that we don't have to do everything ourselves. 
This short video not only gives a quick recap of the three main languages but also shares the workflow and other useful packages. 
It also gives some introduction to the back-end including servers and database. 
(which is definitely out of scope for this post but may or may not be included and introduced in future posts.)

### Useful Tools

- GitHub [Tutorial](https://docs.github.com/en/get-started/quickstart/hello-world) and [Pages (website hosting)](https://pages.github.com/).

- [HTMLrev](https://htmlrev.com/): a website that offers landing page HTML templates.

    This may help you jump start your project! 
    Most of them includes the [Bootstrap](https://getbootstrap.com/) library, a very useful tool, and here is a [tutorial](https://www.w3schools.com/bootstrap/bootstrap_get_started.asp) for it.

- [npm](https://www.npmjs.com/): a Package Manager that helps you manage tools. 

    Here is a [tutorial](https://youtu.be/jHDhaSSKmB0).
    (One may recommend [nvm](https://github.com/nvm-sh/nvm) more since it manages versions of packages better.)

- [Sass](https://sass-lang.com/) (Syntactically Awesome Style Sheets): an extension to CSS.
    
    Here is a [crash course](https://youtu.be/nu5mdN2JIwM) by Traversy Media.

- Responsive Design: a web design method that fits any viewing device.

    A long tutorial with an example can be viewed [here](https://youtu.be/gH3sBOj6CGA).

### The Next Step?

I am not sure who will be the readers of this post. 
For me, I started merely wanting to create a portfolio website for myself on GitHub and then later found out that there are actually great amounts of stuff that can be learned in this area. 
(In fact, too many...) 
One may check [this 2022 review video](https://youtu.be/EqzUcMzfV1w) and go through it to see how many things you have learned or known and how many others you may proceed on learning for just being a front-end engineer. 
Wish you have a good journey out there!

## References

- Most of the video links are from these two YouTube channels:

    [Programming with Mosh](https://www.youtube.com/c/programmingwithmosh) and [Traversy Media](https://www.youtube.com/c/TraversyMedia)
    
- [W3Schools](https://www.w3schools.com/): Online web tutorials
- [Semantic HTML - How to Write Clean Code (Beginner)](https://youtu.be/wu6PPRKcT8Y)
- [10 CSS Pro Tips - Code this, NOT that!](https://youtu.be/Qhaz36TZG5Y)
- [Responsive Web Design Tutorial](https://youtu.be/Qhaz36TZG5Y)
- [Learn web development as an absolute beginner](https://youtu.be/ysEN5RaKOlA)





