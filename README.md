# Plenty

[![Build Status](https://travis-ci.com/pieterbeulque/plenty.svg?branch=master)](https://travis-ci.com/pieterbeulque/plenty) [![Coverage Status](https://coveralls.io/repos/github/pieterbeulque/plenty/badge.svg?branch=master)](https://coveralls.io/github/pieterbeulque/plenty?branch=master)

Render a Twig template for every row of a CSV. This might come in handy to generate color variants on SVG-files, HTML e-mail signatures for everyone in your company, …

## Usage

```sh
npx plenty --csv data.csv --template template.html
```

Every CSV column is available in Twig through `{{ columnName }}`. Keep in mind that there currently is no validation on column names & their Twig-compatibility, so it might be a good idea to verify this yourself.  
I'd be glad to accept a PR for this.

There are also two optional arguments:

```
--output output
  Output directory

--filename '{{ _row }}'
  Template for file naming.
  All variables from the CSV are available here.
  Use {{ _row }} to render the row number
```

## Example

Assume these source files:

**people.csv**

```
firstName,lastName
Justin,Vernon
Jeremy,Bolm
```

**signature.html**

```html
<p>Kind regards,</p>
<p>{{ firstName }} {{ lastName }}</p>
```

When we run this command:

```sh
npx plenty --csv people.csv --template signature.html --filename '{{ firstName }}'
```

We will end up with these two files:

```html
<!-- justin.html -->
<p>Kind regards,</p>
<p>Justin Vernon</p>
```

```html
<!-- jeremy.html -->
<p>Kind regards,</p>
<p>Jeremy Bolm</p>
```
