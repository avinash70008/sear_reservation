import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainReservation = () => {
  const [seats, setSeats] = useState([]);
  const [numSeats, setNumSeats] = useState("");
  const [book,setBook]=useState([])
  const [msg,setMsg]=useState("")

  useEffect(() => {
    // Fetch all seats from the backend
    const fetchSeats = async () => {
      try {
      await axios.get('https://kind-teal-fossa-veil.cyclic.app/seat')
        .then((res)=>{
            console.log(res)
            function compare(a,b){
                return a.seatNumber-b.seatNumber
            }

            let y=res.data.seats
           y.sort(compare)
            setSeats(y);
        })
       
      } catch (error) {
        console.error(error);
      }
    };

    fetchSeats();
  }, []);

  const reserveSeats = async () => {
    try {
      await axios.post('https://kind-teal-fossa-veil.cyclic.app/seat/reserve', { numSeats: parseInt(numSeats) }).then((res)=>{
        console.log(res.data.message);
        
        if(res.data.message){
          setBook(res.data.message)
          
        }
        
        console.log(res)

        
      })
      
      // Refresh the seat data after reservation
     await axios.get('https://kind-teal-fossa-veil.cyclic.app/seat')
     .then((res)=>{
        function compare(a,b){
            return a.seatNumber-b.seatNumber
        }

        let y=res.data.seats
         y.sort(compare)
        setSeats(y);
        setNumSeats('');
        setMsg("")
     })
      
    } catch (error) {
      console.error(error.response.data.error);
      setMsg(error.response.data.error)
      setBook([])
    }
  };

  const resetSeats = async () => {
    try {
      const response = await axios.put('https://kind-teal-fossa-veil.cyclic.app/seat/reset');
      console.log(response.data.message);
      // Refresh the seat data after resetting
      await axios.get('https://kind-teal-fossa-veil.cyclic.app/seat')
      .then((res)=>{
        function compare(a,b){
            return a.seatNumber-b.seatNumber
        }

        let y=res.data.seats
         y.sort(compare)
        setSeats(y)
        setBook([])
      })
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",marginBottom:"50px"}}>
      <h1>Train Reservation</h1>
      <div style={{marginBottom:"15px"}}>
        <div style={{display:"flex"}}>
        <div style={{width:"30px",height:"30px",backgroundColor:"yellow"}}></div>
        <div>-Unreserved Seats</div>
        </div>
        <div style={{display:"flex"}}>
        <div style={{width:"30px",height:"30px",backgroundColor:"greenyellow"}}></div>
        <div>-Reserved Seats</div>
        </div>
      </div>
      <div>
        <label htmlFor="numSeats" style={{fontSize:"25px"}}>Number of Seats:</label>
        <input
          style={{height:"38px"}}
          type="number"
          id="numSeats"
          value={numSeats}
          onChange={(e) => setNumSeats(e.target.value)}
        />
        <button style={{color:"black",width:"200px",marginLeft:"5px",height:"40px",fontSize:"25px"}}  onClick={reserveSeats}>Reserve Seats</button>
        <button style={{color:"orange",width:"200px",marginLeft:"10px",height:"40px",fontSize:"25px"}} onClick={resetSeats}>Reset Seats</button>
      </div>
      <div style={{display:"flex",gap:"50px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"10px",marginTop:"50px",alignItems:"center"}}>
      {seats.map((seat) => (
          
           <div key={seat._id} style={{width:"40px",height:"40px",backgroundColor:seat.isBooked ? "greenyellow":"yellow"}}>
          
              {/* <p>{seat.row}</p> */}
              <p>{seat.seatNumber}</p>
              {/* <td>{seat.isBooked ? 'Reserved' : 'Available'}</td> */}
            </div>
          
          ))}
           </div>
        <div >
          <div style={{display:"flex",gap:"10px",marginTop:"20px"}}>
            <h4> Booked Seats No:-</h4>
            {
          book.map((el)=>(
            
           <p>{el}</p>
             
            ))}
           </div>

           <div>
            <h4 style={{color:"red"}}>{msg}</h4>
           </div>
           </div>
           </div>
    </div>
  );
};

export default TrainReservation;