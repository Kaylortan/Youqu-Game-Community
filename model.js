'use strict';
function createDemoModel(base, saved) {
 const levels=[null,{min:0,rate:1},{min:68,rate:.98},{min:328,rate:.95},{min:1000,rate:.92},{min:3000,rate:.9}];
 const seedOrders=[100,100,100].map((face,i)=>({id:'YQ2026110'+(5+i*2)+'00'+i,gameId:i+1,account:String(100860+i),face,rate:i?.98:1,level:i?2:1,paid:face*(i?.98:1),status:'arrived',created:`2026-11-0${5+i*2} 15:20`,paidAt:`2026-11-0${5+i*2} 15:21`,credited:true}));
 const seedTeams=Array.from({length:16},(_,i)=>({id:'t'+(i+1),gameId:i%3+1,title:['一起经营小店，日常互助','找花友，一起分享花园搭配','城市伙伴集合啦'][i%3],description:'欢迎喜欢这款游戏的朋友一起交流，分享日常玩法和小小发现。轻松交流，友好互助。',qr:'assets/qr-group.svg',expiry:i===2?'2026-10-31':i%2?'长期有效':'2026-12-31',status:'published',owner:'reader-'+i,created:`2026-11-${String(10-Math.floor(i/3)).padStart(2,'0')} 10:20`,reason:''}));
 const owned=['pending','rejected','published','removed'].map((status,i)=>({...seedTeams[i],id:'own-'+i,owner:'demo-user-2026',status,reason:status==='rejected'?'描述中包含无关推广内容，请修改后提交。':status==='removed'?'经人工核查，帖子包含违规引流内容，已下架。':'',created:'2026-11-11 0'+(9-i)+':15'}));
 const state=saved||{user:{logged:false,id:'demo-user-2026',openId:'oYouqu-Portal-Demo-2026',name:'玩家小友',avatar:'assets/avatar-1.svg',accounts:base.games.map((g,i)=>({gameId:g.id,account:String(100860+i)}))},orders:seedOrders,teams:[...owned,...seedTeams],posts:base.posts,recs:base.recs,codes:base.codes,comments:{},pendingReplies:{},history:[],follows:[],rewards:[],monthClaims:[{id:'month-old',gameId:3,month:'2026-10',level:2,code:'YOUQU-OCT-CITY-2026',expiry:'2026-12-31',created:'2026-10-20 10:30'}],equip:{title:2,frame:2,medal:2},period:'2026-11',read:[],seq:100};
 const levelFor=amount=>[1,2,3,4,5].filter(l=>amount>=levels[l].min).at(-1)||1;
 const cumulative=()=>state.orders.filter(o=>(!o.userId||o.userId===state.user.id)&&o.credited&&o.status!=='refunded').reduce((n,o)=>n+o.face,0);
 const level=()=>levelFor(cumulative());
 const now=()=>{const stamp=new Date(`${state.period}-${state.period==='2026-11'?'12':'01'}T15:00:00Z`);stamp.setUTCSeconds(state.seq);return stamp.toISOString().replace('T',' ').slice(0,19);};
 const id=prefix=>prefix+Date.now().toString(36)+(++state.seq);
 function syncDefaults(){const l=level();state.equip={title:l,frame:l,medal:l};}
 syncDefaults();
 state.pendingReplies??={};
 state.chatThreads??=[];
 state.gameReadPosts??={};
 state.players??={};
 for(const t of state.teams){if(t.owner===state.user.id||state.players[t.owner])continue;const n=Number(t.owner.split('-').at(-1))||0;state.players[t.owner]={id:t.owner,name:['晚风与花','小岛玩家','布丁同学','甜甜圈'][n%4],avatar:'assets/avatar-'+(n%4+1)+'.svg',level:n%5+1};}
 for(const o of state.orders)o.userId??=state.user.id;
 const ownedOrders=()=>state.orders.filter(o=>o.userId===state.user.id);
 const findOrder=orderId=>state.user.logged?ownedOrders().find(o=>o.id===orderId):null;
 for(const t of state.chatThreads)for(const message of t.messages)if(message.status==='sending')message.status='failed';
 for(const claim of state.monthClaims)claim.userId??=state.user.id;
 for(const t of state.teams)delete t.contact;
 delete state.gifts;
 function membershipChange(before){const after=level();syncDefaults();return{before,after,upgraded:after>before};}
 function createOrder(gameId,face,account){
  if(!state.user.logged)throw Error('请先登录');
  if(!account)throw Error('请先在对应游戏登录并确认账号');
  if(![6,30,68,100,128,328,648,1000,3000].includes(Number(face)))throw Error('请选择有效充值档位');
  const l=level(),rate=levels[l].rate;
  const o={id:id('YQ'),userId:state.user.id,gameId:Number(gameId),account,face:Number(face),level:l,rate,paid:Math.round(face*rate*100)/100,status:'unpaid',created:now(),credited:false};
  state.orders.unshift(o);return o;
 }
 function pay(orderId,outcome='success',delivery='arrived'){
  const o=findOrder(orderId);if(!o)throw Error('订单不存在或无查看权限');
  if(o.credited)return{order:o,before:level(),after:level(),upgraded:false};
  if(['closed','refunded'].includes(o.status))throw Error('订单当前不能继续支付');
  if(outcome!=='success'){o.status=outcome==='fail'?'failed':'unpaid';return{order:o,cancelled:outcome==='cancel',failed:outcome==='fail'};}
  const before=level();o.credited=true;o.status=delivery;o.paidAt=now();return{order:o,...membershipChange(before)};
 }
 function refund(orderId){const o=findOrder(orderId);if(!o?.credited||o.status==='refunded')return null;const before=level();o.status='refunded';o.refundedAt=now();return membershipChange(before);}
 function issueJump(gameId,campaignId,sourceGame=1){if(!state.user.logged||Number(gameId)===Number(sourceGame)||!campaignId||!base.games.some(g=>g.id===Number(gameId)))return null;return{id:id('J'),userId:state.user.id,gameId:Number(gameId),sourceGame:Number(sourceGame),campaignId,expires:Date.now()+300000};}
 function fulfillJump(ticket,targetGame,outcome='success',currentUser=state.user.id){
  if(!ticket||!state.user.logged)return{status:'guest'};
  if(ticket.userId!==currentUser||ticket.sourceGame===ticket.gameId||ticket.gameId!==Number(targetGame)||ticket.expires<Date.now())return{status:'invalid'};
  const old=state.rewards.find(r=>r.userId===ticket.userId&&r.campaignId===ticket.campaignId);if(old)return{status:'already',record:old};
  if(outcome!=='success')return{status:outcome};
  const record={id:id('R'),userId:ticket.userId,campaignId:ticket.campaignId,gameId:ticket.gameId,sourceGame:ticket.sourceGame,reward:'金币 × 1000、游戏道具 × 3',created:now()};state.rewards.push(record);return{status:'success',record};
 }
 function giftDetails(gameId,l){const g=base.games.find(g=>g.id===Number(gameId));if(!g||l<2)return null;const coins=[0,0,1000,2000,4000,8000][l],tools=[0,0,3,5,8,12][l];return{title:['','','每月小礼包','每月中礼包','每月大礼包','豪华限定礼包'][l],reward:`金币 × ${coins}、加速道具 × ${tools}`+(l>=4?'、'+(l===5?'豪华限定外观':'限定皮肤')+' × 1':'')};}
 function giftExpiry(mode='month'){const [y,m]=state.period.split('-').map(Number);return mode==='year'?`${y}-12-31`:new Date(Date.UTC(y,m,0)).toISOString().slice(0,10);}
 function monthlyOffer(gameId,expiryMode='month'){
  if(!state.user.logged)return null;const old=state.monthClaims.find(c=>c.userId===state.user.id&&c.month===state.period&&c.gameId===Number(gameId));
  if(old)return{...giftDetails(gameId,old.level),...old};const details=giftDetails(gameId,level());return details?{gameId:Number(gameId),level:level(),month:state.period,expiry:giftExpiry(expiryMode),...details}:null;
 }
 function monthClaim(gameId,expiryMode='month'){
  if(!state.user.logged)throw Error('请先登录');
  const old=state.monthClaims.find(c=>c.userId===state.user.id&&c.month===state.period&&c.gameId===Number(gameId));if(old)return old;
  const offer=monthlyOffer(gameId,expiryMode);if(!offer)throw Error('Lv2起可查看会员礼包');if(offer.expiry<now().slice(0,10))throw Error('本月礼包已停止分配');
  const c={...offer,id:id('M'),userId:state.user.id,code:`YQ-${state.period.replace('-','')}-${gameId}-${state.seq}`,created:now()};state.monthClaims.unshift(c);return c;
 }
 const chatNow=now;
 const gamePosts=g=>state.posts.filter(p=>p.gameId===Number(g)&&['news','strategy'].includes(p.type)).sort((a,b)=>(b.fullDate||'').localeCompare(a.fullDate||'')||b.id.localeCompare(a.id));
 const publicationKey=p=>p.id+'@'+p.fullDate;
 const gameUnread=g=>state.user.logged?gamePosts(g).filter(p=>!(state.gameReadPosts[g]||[]).includes(publicationKey(p))).length:0;
 function readGame(g){if(state.user.logged)state.gameReadPosts[g]=gamePosts(g).map(publicationKey);}
 function messageFeed(){
  if(!state.user.logged)return[];
  const items=base.games.flatMap(g=>{const posts=gamePosts(g.id);if(!posts.length)return[];return[{kind:'game',key:'game-'+g.id,gameId:g.id,latestAt:posts[0].fullDate,summary:posts[0].title,unread:gameUnread(g.id)}];});
  for(const t of listThreads()){const last=t.messages.filter(m=>m.status==='sent').sort((a,b)=>(a.sentAt||a.created).localeCompare(b.sentAt||b.created)||(a.activityOrder||a.order)-(b.activityOrder||b.order)).at(-1);if(last)items.push({kind:'player',key:t.id,peerId:t.peerId,latestAt:last.sentAt||last.created,summary:last.type==='image'?'[图片]':last.content,unread:t.unread,activityOrder:t.activityOrder});}
  return items.sort((a,b)=>b.latestAt.localeCompare(a.latestAt)||(b.activityOrder||0)-(a.activityOrder||0)||a.key.localeCompare(b.key));
 }
 function validPeer(peerId){if(!state.user.logged)throw Error('请先登录');if(peerId===state.user.id)throw Error('不能与自己发起会话');const person=playerProfile(peerId);if(!person)throw Error('该玩家暂不可联系');return person;}
 function threadFor(peerId){if(!state.user.logged)return null;return state.chatThreads.find(t=>t.owner===state.user.id&&t.peerId===peerId)||null;}
 function ensureThread(peerId){validPeer(peerId);let t=threadFor(peerId);if(!t){t={id:id('CHAT'),owner:state.user.id,peerId,messages:[],unread:0,activityOrder:0};state.chatThreads.push(t);}return t;}
 function listThreads(){if(!state.user.logged)return[];return state.chatThreads.filter(t=>t.owner===state.user.id&&t.messages.some(m=>m.status==='sent')).sort((a,b)=>b.activityOrder-a.activityOrder);}
 function queueMessage(peerId,type,content){
  validPeer(peerId);if(!['text','image'].includes(type)||!String(content||'').trim())throw Error('请填写消息内容');
  if(type==='image'&&!/^(assets\/|data:image\/(?:png|jpeg|webp|gif|svg\+xml);)/.test(content))throw Error('请选择有效图片');
  const t=ensureThread(peerId),message={id:id('MSG'),from:state.user.id,type,content:type==='text'?content.trim():content,created:chatNow(),order:++state.seq,status:'sending'};t.messages.push(message);return message;
 }
 function finishMessage(peerId,messageId,success=true){const t=threadFor(peerId),m=t?.messages.find(m=>m.id===messageId&&m.from===state.user.id);if(!m)throw Error('消息不可操作');if(m.status==='sent')return m;m.status=success?'sent':'failed';if(success){m.activityOrder=++state.seq;m.sentAt=chatNow();t.activityOrder=m.activityOrder;}return m;}
 function retryMessage(peerId,messageId){validPeer(peerId);const m=threadFor(peerId)?.messages.find(m=>m.id===messageId&&m.from===state.user.id);if(!m||m.status!=='failed')throw Error('当前消息不可重试');m.status='sending';return m;}
 function receiveMessage(peerId,type='text',content='你好，一起交流游戏日常吧！',read=false){const t=ensureThread(peerId);if(!['text','image'].includes(type)||!content)throw Error('消息内容为空');const message={id:id('MSG'),from:peerId,type,content,created:chatNow(),order:++state.seq,status:'sent'};t.messages.push(message);t.activityOrder=++state.seq;if(!read)t.unread++;return message;}
 function readThread(peerId){validPeer(peerId);const t=threadFor(peerId);if(t)t.unread=0;}
 function readAllThreads(){if(state.user.logged)for(const t of state.chatThreads)if(t.owner===state.user.id)t.unread=0;}
 function validateTeam(f){
  if(!state.user.logged)throw Error('请先登录');
  if(!f.title?.trim()||f.title.length>30)throw Error('请填写30字以内的组队标题');
  if(!Number(f.gameId)||!base.games.some(g=>g.id===Number(f.gameId)))throw Error('请选择所属游戏');
  if(!f.description?.trim()||f.description.length>500)throw Error('请填写500字以内的组队描述');
  if(!f.qr)throw Error('请上传一张二维码');if(!f.expiry)throw Error('请填写二维码有效期或选择长期有效');
 }
 function editableTeam(t){return state.user.logged&&t?.owner===state.user.id&&['published','rejected','removed'].includes(t.status);}
 function submitTeam(f,editId){
  validateTeam(f);let t=editId?state.teams.find(t=>t.id===editId):null;
  if(editId&&!editableTeam(t))throw Error(t?.status==='pending'?'审核中，暂不可编辑或删除':'当前记录不可编辑');
  const clean={title:f.title.trim(),gameId:Number(f.gameId),description:f.description.trim(),qr:f.qr,expiry:f.expiry};
  if(t)Object.assign(t,clean,{status:'pending',reason:'',updated:now()});
  else{t={...clean,id:id('T'),owner:state.user.id,status:'pending',reason:'',created:now()};state.teams.unshift(t);}return t;
 }
 function deleteTeam(tid){const t=state.teams.find(t=>t.id===tid);if(!editableTeam(t))throw Error(t?.status==='pending'?'审核中，暂不可编辑或删除':'没有操作权限');state.teams=state.teams.filter(t=>t.id!==tid);}
 function publicTeams(){return state.teams.filter(t=>t.status==='published').sort((a,b)=>b.created.localeCompare(a.created));}
 function memberFixture(l){const total=[0,0,68,328,1000,3000][l];state.orders=total?[{...seedOrders[0],id:id('YQ'),userId:state.user.id,face:total,paid:total,level:1,rate:1,status:'arrived',credited:true,created:now()}]:[];syncDefaults();}
 function playerProfile(userId){
  if(userId===state.user.id){const result={id:userId,name:state.user.name,avatar:state.user.avatar,level:level(),own:state.user.logged};if(result.own){result.openId=state.user.openId;result.accounts=state.user.accounts;}return result;}
  const person=state.players[userId];return person?{...person,own:false}:null;
 }
 return{state,levelFor,level,cumulative,now,id,syncDefaults,ownedOrders,findOrder,createOrder,pay,refund,issueJump,fulfillJump,giftDetails,giftExpiry,monthlyOffer,monthClaim,gameUnread,readGame,messageFeed,validPeer,threadFor,listThreads,queueMessage,finishMessage,retryMessage,receiveMessage,readThread,readAllThreads,validateTeam,editableTeam,submitTeam,deleteTeam,publicTeams,memberFixture,playerProfile};
}
if(typeof module!=='undefined')module.exports={createDemoModel};
