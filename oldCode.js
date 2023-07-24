//v1
app.get("/:id",async(req,res)=>{
  let {id}=req.params.id
let {data}=await axios.get(episodes,{
  headers:{
    "Content-Type":"text/html"
  }
})
let $=cheerio.load(data.html)
let list=$('.ep-item')
// //
let episodeIds=[]
// //
list.map((e,i)=>{
  let epId=$(i).attr('data-id')
  let ep=$(i).find('.ssli-order').text()
  let title=$(i).find('.ep-name').text()
  episodeIds.push({epId,ep,title})
// //
})
//console.log(list.length)
episodeIds.map(async(e,i)=>{
  let {data}=await axios.get(
  `https://aniwatch.to/ajax/v2/episode/servers?episodeId=${e.epId}`
    ,{
  headers:{
    "Content-Type":"text/html"
  }
})
let car=cheerio.load(data.html)
//console.log(data.html)
let dub=car('.servers-dub').find('.ps__-list').find('.item')
if(dub.length>0){
  dub.map((p,i)=>{
    let ser=car(i).attr('data-id')
    let serverId=car(i).attr('data-server-id')
let newServer=episodeIds.find((n)=>n.epId===e.epId)
if(!newServer.serverId){
 episodeIds.filter((n)=>n.epId===e.epId)[0].serverId=ser
 //console.log(episodeIds)
}else{}
  })
}else{
console.log('no')
}
console.log('\n')
})
// //
setTimeout(() => {
  res.send(episodeIds)
}, 1500)
})

//v2
app.get("/:id", async (req, res) => {
  let { id } = req.params;
  console.log(typeof id)
  let { data } = await axios.get(
    `https://aniwatch.to/ajax/v2/episode/list/${id}`
    ,{
    headers: {
      "Content-Type": "text/html",
    },
  });
  let $ = cheerio.load(data.html);
  let list = $(".ep-item");
  
  let pro=await Promise.all(
    list.map(async(e,i)=>{
    let epId=$(i).attr('data-id')
    let ep=$(i).find('.ssli-order').text()
    let title=$(i).find('.ep-name').text()
    let serverId;
    let link;
    let type;
let {data}=await axios.get(
  `https://aniwatch.to/ajax/v2/episode/servers?episodeId=${epId}`
    ,{
  headers:{
    "Content-Type":"text/html"
  }
})
let server=cheerio.load(data.html)
let dub=server('.servers-dub').find('.ps__-list').find('.item')
let sub=server('.servers-sub').find('.ps__-list').find('.item')
if(dub.length>0){
  type='dub'
  dub.map((p,c)=>{
    if(!serverId){
      serverId=server(c).attr('data-id')
    }
  })
  
  let {data}=await axios.get(
  `https://aniwatch.to/ajax/v2/episode/sources?id=${serverId}`
    ,{
  headers:{
    "Content-Type":"text/html"
  }
})
link=data.link
}else{
  type='sub'
    sub.map((p,c)=>{
    if(!serverId){
      serverId=server(c).attr('data-id')
    }
  })
  
  let {data}=await axios.get(
  `https://aniwatch.to/ajax/v2/episode/sources?id=${serverId}`
    ,{
  headers:{
    "Content-Type":"text/html"
  }
})
link=data.link
}

return {epId,ep,title,serverId,link,type}
    }))
    res.send(pro)
});
