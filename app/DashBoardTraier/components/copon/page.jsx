import CouponGenerator from './CouponGenerator';
import CouponList from './CouponList';
import InvitationLink from './InvitationLink';

import React from 'react'

function page() {
  return (
    <div className="space-y-6">
       <CouponGenerator />
       <CouponList />  
       <InvitationLink />
    </div>
  )
}

export default page

