import React from 'react'
import Livematches from './Livematches'
import Upcomingmatches from './Upcomingmatches'
import Spinner from './Spinner'

function Matches() {
  const liveMatches = Livematches().props.children[1];
  
  return (
    <div>
     
       <div >
       {liveMatches.length > 0 && (
          <h1 className='text-center'>Live Matches</h1>
        )}
      </div><br></br>
      <div>
        <Livematches />
      </div>
    <div>
        <h1 className='text-center'>Upcoming Matches</h1><br></br>
        
        <div>
        <Upcomingmatches/>
        </div>
    </div>
    
      
    </div>
  )
}

export default Matches