const PORT = process.env.PORT || 8080
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const { response } = require('express')
const res = require('express/lib/response')
const req = require('express/lib/request')
const { contains } = require('cheerio/lib/static')
const { attr } = require('cheerio/lib/api/attributes')


 const app = express()

 const newspapers = [
     {
         name:'thetimes',
         address: 'https://www.thetimes.co.uk/environment/climate-change',
         base: ''
     },

     {
        name:'guardian',
        address: 'https://www.theguardian.com/environment/climate-change',
        base:''
    },
    {
        name:'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base:''
    },
    {
        name:'economist',
        address: 'https://www.economist.com/climate-change?utm_medium=cpc.adword.pd&utm_source=google&utm_campaign=a_21climatechange.2021-10-07&utm_content=conversion.other-brand.anonymous&gclid=Cj0KCQjwg_iTBhDrARIsAD3Ib5jOMEDTC_P9bPBEwkhIT4OTtiULsrOCg1MQ1g-P2TTlwMQ-vz2foIMaAjaoEALw_wcB&gclsrc=aw.ds',
        base:''
    },    
    {
        name:'bbc',
        address: 'https://www.bbc.com/news/science-environment-56837908 ',
        base:''
    },
    {
        name:'downtoearth',
        address: 'https://www.downtoearth.org.in/climate-change ',
        base:''
    },
   {
        name:'cnn',
        address: 'https://edition.cnn.com/specials/world/cnn-climate ',
        base:''
    },
   {
        name:'nasa',
        address: 'https://climate.nasa.gov/',
        base:''
    },
   {
        name:'who',
        address: 'https://www.who.int/health-topics/climate-change',
        base:''
    }
 ]
const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)



        $('a :contains("climate")', html).each(function(){
        const title =$(this).text()
          const url = $(this).attr('href')
          articles.push({
              title,
              url : newspaper.address,
              source:newspaper.name
          })
        })
    })
})



 app.get('/',(req , res ) => {
     res.json('Welcome to my Climate Change News API' +" "+ 'Made by PrithishG')
 } )

 app.get('/news',(req,res) =>{
     res.json(articles)

 })

 app.get('/news/:newspaperId',(req,res) => {
     const newspaperId = req.params.newspaperId


   const newspaperAddress =  newspapers.filter(newspaper => newspaper.name ==  newspaperId)[0].address
   const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
/*    console.log(newspaperaddress) */


     axios.get(newspaperAddress)
     .then(response => {
         const html = response.data
         const $ = cheerio.load(html)
         const specificArticles = []


         $('a:contains("climate")', html).each(function () {

            const title = $(this).text()
            const url = $(this).attr('href')

            specificArticles.push({
                title,
                url: newspaperBase + url,
                source : newspaperId
            })

     })
     res.json(specificArticles)
 }).catch(err => console.log(err))

})

 app.listen(PORT, () => console.log('server runing on PORT ${PORT}' ))
