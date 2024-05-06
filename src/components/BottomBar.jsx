import React from 'react'
import { Link } from 'react-router-dom'
import './bottombar.css'
function BottomBar() {
    return (
        <div>
          <div className="bg-dark container-fluid position-fixed bottom-0 start-0">
            <div className="row align-items-center ">
              
              <div className="col-4 d-flex justify-content-center"><Link className="text-white no-underline" to={'utils/policy'}>Privacy Policy</Link></div>
              <div className="col-4 d-flex justify-content-center"><Link className="text-white no-underline" to={'utils/terms'}>Terms</Link></div>
              <div  className="col-4 d-flex justify-content-center"><Link className="text-white no-underline" to={'contactus'}>Contact us</Link></div>
             
            </div>
          </div>
        </div>
      )
}

export default BottomBar