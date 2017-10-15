# Feelpad

### Feelpad is text

Write markdown on the left, see the preview on the right. No more github screwups. What's more, you can save the result as a pdf. Smart for sharing a markdown doc with the non-tech people outside of our bubble :P

### Feelpad is feelings

Don't waste time on stupid negative news. Just copy and paste the article in feelpad, and if it's grey and the emoji is bad, don't even bother reading it. You'll feel better reading less about terrorists and Trump, I promise :*)

The text sentiment polarity is analyzed and classified in one of 5 emotions:
- amazing
- positive
- neutral
- negative
- awful

Then, a rotating emoji is rendered according to the overall sentiment of the text, and the background color of the rendered markdown changes accordingly. The more red, the better. The more grey, the worse the emotions of the text are.

### Technical blablabla

There is a frontend client made in React and ES6 that uses functional stateless components as much as possible, and the backend is a Python microservice made with Flask, which I tried to make as simple as possible. For sentiment analysis, the package TextBlob is used alongside a mapper of sentiment number from -1 to 1 from TextBlob to one of the 5 previous sentiments.

### Some sort of a conclusion

It might not be the most focused nor the best project, but it was a nice adventure. Hope you enjoy using it as much as I do :)