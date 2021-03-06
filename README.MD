[![npm version](https://badge.fury.io/js/hexo-front-matter-editor.svg)](https://badge.fury.io/js/hexo-front-matter-editor)
[![Build Status](https://www.travis-ci.org/kamilic/hexo-front-matter-editor.svg?branch=master)](https://www.travis-ci.org/kamilic/hexo-front-matter-editor)
[![codecov](https://codecov.io/gh/kamilic/hexo-front-matter-editor/branch/master/graph/badge.svg)](https://codecov.io/gh/kamilic/hexo-front-matter-editor)

# hexo-front-matter-editor

A simple library to read / write / create markdown files of hexo blog posts.

### APIs

#### Editor.read(```String``` from)
Read your hexo markdown file and parse it to an FrontMatterData object.
- from / the path of your post markdown file.

returns Promise<```FrontMatterData``` result>

#### Editor.create(```Object``` initObj)
Create an FrontMatterData object.

returns ```FrontMatterData``` result;

#### Editor.write(```FrontMatterData``` data, ```Object``` to)
- initObj / a FrontMatterData object
- to / the output markdown file path.


### ```FrontMatterData``` APIs
It just a simple key-value pair handler.

#### FrontMatterData.add(```String``` key, ```String | Date | Array | null | undefined``` value)
Add a key-value pair;

#### FrontMatterData.remove(```String``` key, ```String | Date | Array | null | undefined``` value)
Remove key-value pair;

#### FrontMatterData.set(```String``` key, ```String | Date | Array | null | undefined``` value)
Set an exist key with a new value.
If key doesn't exist in object, it will add a new key-value pair instead.

#### Notice 
All methods in ```FrontMatterData```, you always should not to use Object (Date/Array/null are not included) as your ```value``` input. 
When you use ```Editor.write()```  to output your ```FrontMatterData``` to a markdown file(s), that Object value will be transformed to ```"[Object Object]"```.
This is the default behavior of [hexo-front-matter](https://www.npmjs.com/package/hexo-front-matter).