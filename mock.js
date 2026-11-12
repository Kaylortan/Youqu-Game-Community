function makeDemoData(){
  const games=[{id:1,key:'food',name:'舌尖上的中国'},{id:2,key:'flower',name:'心动花城'},{id:3,key:'city',name:'全民企业家'}].map(g=>({...g,icon:`assets/${g.key}-icon.svg`,cover:`assets/${g.key}-cover.svg`}));
  const names=['小岛玩家','晚风与花','芝士就是力量','认真开店中','阿栗','今天也要开心'];
  const discussionTexts=[
    '今天终于把小店升到新等级啦！整理了一点经营心得，先把招牌菜升级，日常任务也别忘记领。大家都在研究什么搭配？',
    '新开的花圃太治愈了，随手搭了一组粉白配色。分享今天的小花园，欢迎来交流搭配灵感。',
    '从第一间小店到现在的商业街，慢慢积累也很有成就感。你们会先升级哪一栋建筑？',
    '这周尝试把资源集中在一个方向，进度比之前快了一些。有没有一起交流日常任务的小伙伴？',
    '游戏里的小细节真的很可爱，忍不住记录一下。下班之后玩一会儿，感觉心情都变好了。',
    '新手来报道！刚开始玩，有哪些值得注意的小技巧？欢迎大家在评论区分享经验。'
  ];
  const posts=[];
  for(let i=0;i<18;i++){
    const g=games[i%3];
    posts.push({id:String(1001+i),type:'news',gameId:g.id,game:g.name,author:g.name,avatar:g.icon,title:[`${g.name}｜本周活动内容一览`,'更新公告：一起发现更多游戏乐趣','新一期福利活动正式开启'][i%3]+(i>=3?' · 第'+(Math.floor(i/3)+1)+'期':''),content:`亲爱的玩家：\n感谢大家一直以来的陪伴与支持。本周我们为大家准备了新的游戏内容和活动资讯，一起开启轻松愉快的游戏时光。\n活动内容\n完成游戏内的日常任务，发现更多收集与经营的乐趣。具体活动时间及奖励请以游戏内展示为准。\n温馨提示\n合理安排游戏时间，与朋友分享你的游戏故事。`,description:'本周新内容来啦！来看看最新活动与更新资讯，一起开启轻松的游戏时光。',cover:g.cover,images:[],date:'11-09 10:00',fullDate:'2026-11-09 10:00',likeCount:26+i*3,commentCount:7,liked:false});
    posts.push({id:String(2001+i),type:'strategy',gameId:g.id,game:g.name,author:g.name,avatar:g.icon,title:[ '新手入门：小店经营的三个小技巧','花园搭配指南：打造自己的浪漫角落','经营进阶：资源如何合理分配'][i%3]+(i>=3?' · '+(Math.floor(i/3)+1):''),content:'第一次进入游戏，不妨从日常任务开始，熟悉各个入口和基础玩法。\n一、先熟悉自己的节奏\n按当前目标合理分配资源，先完成容易达成的任务，逐步解锁更多内容。\n二、记录你的经营心得\n不同的搭配可能带来不同体验。遇到喜欢的画面，也可以在社区中分享。\n三、和玩家一起交流\n这份内容是演示用的示例攻略，欢迎在评论里聊聊你的游戏发现。',description:'从基础任务到资源安排，整理几个容易上手的小技巧，和大家一起轻松进阶。',cover:g.cover,images:[],date:'11-08 16:30',fullDate:'2026-11-08 16:30',likeCount:18+i*2,commentCount:7,liked:false});
  }
  for(let i=0;i<15;i++){
    const g=games[i%3];posts.push({id:String(3001+i),type:'discuss',gameId:g.id,game:g.name,author:names[i%6],authorId:'other-'+i,avatar:`assets/avatar-${i%4+1}.svg`,content:discussionTexts[i%6]+' #'+g.name,images:i%4===3?[]:[g.cover,...(i%3===0?[games[(i+1)%3].cover,g.icon]:[])],date:'11-09 '+String(10-Math.floor(i/6)).padStart(2,'0')+':'+String(12+i*2).padStart(2,'0'),fullDate:'2026-11-09 10:12',likeCount:12+i*2,commentCount:7,liked:false,status:'approved',mine:false});
  }
  const own=[
    {id:'3101',content:'给今天的小花园留个纪念，慢慢搭配的过程也很开心。 #心动花城',images:[games[1].cover],status:'approved',gameId:2,commentCount:7,likeCount:16},
    {id:'3102',content:'刚整理好的小店日常，分享给一起玩的小伙伴。 #舌尖上的中国',images:[games[0].cover],status:'pending',gameId:1,commentCount:0,likeCount:0},
    {id:'3103',content:'记录一下最近的经营计划，下一步准备升级街区。 #全民企业家',images:[],status:'rejected',rejectReason:'内容包含与游戏无关的信息，请修改后重新提交。',gameId:3,commentCount:0,likeCount:0}
  ].map(p=>({...p,type:'discuss',game:games[p.gameId-1].name,author:'玩家小友',authorId:'demo-user-2026',avatar:'assets/avatar-1.svg',date:'11-08 18:20',fullDate:'2026-11-08 18:20',mine:true,liked:false}));
  posts.push(...own);
  for(const g of games)posts.push({id:'official-'+g.id,type:'discuss',gameId:g.id,game:g.name,author:g.name,authorId:'official-'+g.id,official:true,avatar:g.icon,content:'欢迎来到'+g.name+'！一起分享游戏里的新发现。 #'+g.name,images:[g.cover],date:'11-12 09:00',fullDate:'2026-11-12 09:00',likeCount:56,commentCount:7,liked:false,status:'approved',mine:false});
  for(let i=0;i<9;i++){
    const g=games[i%3];
    posts.push({...own[0],id:String(3110+i),gameId:g.id,game:g.name,content:`记录第 ${i+1} 次游戏小发现，和朋友一起交流日常。 #${g.name}`,images:i%2?[g.cover]:[],date:'11-0'+(7-Math.floor(i/3))+' 16:20',fullDate:'2026-11-07 16:20',likeCount:i+2,commentCount:7});
  }
  const recs=Array.from({length:12},(_,i)=>{const g=games[i%3];return {id:String(4001+i),type:'recommendation',gameId:g.id,game:g.name,author:g.name,avatar:g.icon,title:[ '食光正好，一起开家小店','花开正当时，心动每一天','开启属于你的城市故事'][i%3]+(i>=3?' · '+(Math.floor(i/3)+1):''),description:'发现游戏中的小小美好，和朋友一起分享快乐。',content:'在游戏里，收集一点小小的快乐。\n这里为你整理了本期推荐内容，一起感受经营、搭配和探索的乐趣。\n用自己的节奏，创造喜欢的游戏生活。活动具体内容请以游戏内说明为准。',cover:g.cover,images:[],date:'11-09 09:00',fullDate:'2026-11-09 09:00',linkType:i%3===0?'page':i%3===1?'webview':'miniapp'};});
  const channels=['全部渠道','微信小游戏','官方社区','游戏活动'];
  const codes=games.flatMap(g=>Array.from({length:12},(_,i)=>({id:`${g.id}-${i+1}`,gameId:g.id,title:['新手见面礼','周末惊喜福利','社区专属礼包','本周游戏福利'][i%4]+(i>=4?' · '+(Math.floor(i/4)+1):''),code:['YOUQU2026','HAPPY666','COMMUNITY888','GAME2026'][i%4]+(i>=4?String(i):''),reward:['金币 × 1000、加速券 × 3','游戏道具 × 5、体力 × 100','金币 × 500、幸运券 × 2'][i%3],permanent:i%3===0,endAt:i===11?'2026-10-01':'2026-12-31',channel:channels[i%3+1],hasApp:i!==10})));
  const notifications=Array.from({length:12},(_,i)=>({id:5001+i,author:names[i%6],avatar:`assets/avatar-${i%4+1}.svg`,date:'11-09',summary:i%2?'点赞了你的帖子':'回复了你的评论',postId:'3101',commentId:'3101-c'+(i%7+1),type:'discuss',cover:i%3===0?games[1].cover:'',liked:false}));
  return {games,posts,recs,channels,codes,notifications,comments:{},pendingReplies:{}};
}

function makeComments(postId){
  return Array.from({length:7},(_,i)=>({id:`${postId}-c${i+1}`,author:i===2?'玩家小友':['小岛玩家','晚风与花','芝士就是力量','阿栗'][i%4],authorId:i===2?'demo-user-2026':'reader-'+i,avatar:`assets/avatar-${i%4+1}.svg`,date:'11-09',content:['整理得很清楚，感谢分享！','今天也发现了好多有意思的小细节。','我也来分享一点游戏日常～','这个搭配真不错，有空也试一试。','和朋友一起玩更有乐趣！','学到了，期待下一次分享。','慢慢探索的感觉也很棒。'][i],likeCount:i+1,liked:false,isAuthor:i===3,replies:i===0?[{id:`${postId}-r1`,author:'阿栗',authorId:'reader-r1',avatar:'assets/avatar-3.svg',content:'一起慢慢探索呀！',date:'11-09',likeCount:2,liked:false,isAuthor:false}]:[]}));
}
