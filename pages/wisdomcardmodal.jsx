export default function WisdomCardModal({ card, onClose }) {
  if (!card) return null;
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:999}}>
      <div style={{background:'#fff',borderRadius:24,textAlign:'center',padding:36}}>
        <img src={card.image} alt={card.name} style={{width:90,height:90,borderRadius:16,marginBottom:18}} />
        <h2 style={{color:'#268b65'}}>{card.name} Wisdom Card</h2>
        <p style={{fontWeight:600,color:'#496d39',fontSize:20}}>{card.wisdom}</p>
        <small>{card.fact}</small>
        <div style={{marginTop:18}}><button onClick={onClose} style={{padding:'10px 22px',fontWeight:600,fontSize:16,color:'#fff',background:'#3d8a4e',border:'none',borderRadius:10,cursor:'pointer'}}>Got it!</button></div>
      </div>
    </div>
  );
}
