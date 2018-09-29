# Build Web App using Node

## Overview
Build an app to find out the best Tasty Treats in town!!  

### Tools:
* Node.js  + many add on such as passport
* Express  
* Mongo DB  using [mlab](https://mlab.com)
* Pug templating
* [Mailtrap](https://mailtrap.io) for email testing
* [Postmarkapp](https://postmarkapp.com) for transactional mail

## Problems with npm
Install [Node Version Manager](https://github.com/creationix/nvm/blob/master/README.md#install-script)
Just run curl script and seems to fix permission errors
 
## Hosting
* [Now](https://tasty-treats-lrccmvgnan.now.sh/)
* [Digital Ocean](http://178.128.125.107/) - Use forever to keep App up and running and stop it from baing down


## Sample Data

To load sample data, run the following command in your terminal:

```bash
npm run sample
```

If you have previously loaded in this data, you can wipe your database 100% clean with:

```bash
npm run blowitallaway
```

That will populate 16 stores with 3 authors and 41 reviews. The logins for the authors are as follows:

|Name|Email (login)|Password|
|---|---|---|
|Wes Bos|wes@example.com|wes|
|Debbie Downer|debbie@example.com|debbie|
|Beau|beau@example.com|beau|


