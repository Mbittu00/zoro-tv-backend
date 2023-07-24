import express from "express";
import cors from "cors";
import axios from "axios";
import cheerio from "cheerio";
let app = express();
app.use(express.json());
app.use(cors());

// let episodes = "https://animension.to/public-api/episodes.php?id=2272291555";
// let episode = "https://animension.to/public-api/episode.php?id=1116803836";
// let name='https://animension.to/1731135993'
/*app.get("/:id", async (req, res) => {
  let { id } = req.params;
  let first=[
    `https://animension.to/public-api/episodes.php?id=${id}`,
    `https://animension.to/${id}`
    ]
  try{
    let {data}=await axios.get(
  `https://animension.to/public-api/episodes.php?id=${id}`
    ,{
  headers:{
    "Content-Type":"text/html"
  }
})
    let name=await axios.get(
  `https://animension.to/${id}`
    ,{
  headers:{
    "Content-Type":"text/html"
  }
})
let $=cheerio.load(name.data)
let title=$('.entry-title').text()
let pro=await Promise.all(
  data.map(async(e)=>{
    let {data}=await axios.get(
  `https://animension.to/public-api/episode.php?id=${e[1]}`
    ,{
  headers:{
    "Content-Type":"text/html"
  }
});
let vidLink=JSON.parse(data[3])
return {ep:data[4],link:vidLink['VidCDN-embed']}
  })
  )
res.send(pro)
  }catch(e){
    res.status(500).send(e)
  }
});*/

app.get("/:id", async (req, res) => {
  let { id } = req.params;
  let title;
  let episodes;
 // let epLink="https://animension.to/public-api/episodes.php?id=",id
 // let titleLink="https://animension.to/",id
  let first=[
    {
    uri:`https://animension.to/${id}`,
    type:'title'
    },{
    uri:`https://animension.to/public-api/episodes.php?id=${id}`,
    type:'ep'
    },]
  first.map(async(e)=>{
    if(e.type==='ep'){
      let {data}=await axios.get(
  `https://animension.to/public-api/episodes.php?id=${id}`
    ,{
  headers:{
    "Content-Type":"text/html"
  }
})
      let pro=await Promise.all(
  data.map(async(e)=>{
    let ep=await axios.get(
  `https://animension.to/public-api/episode.php?id=${e[1]}`
    ,{
  headers:{
    "Content-Type":"text/html"
  }
});
let vidLink=JSON.parse(ep.data[3])
return {ep:ep.data[4],link:vidLink['VidCDN-embed'],title}
  })
  )
res.send(pro)
    }else{
      let {data}=await axios.get(
  `https://animension.to/${id}`
    ,{
  headers:{
    "Content-Type":"text/html"
  }
})
let $=cheerio.load(data)
title=$('.entry-title').text()
    }
  })

 // res.send(episodes)
});

app.listen(8080, console.log(8080));
