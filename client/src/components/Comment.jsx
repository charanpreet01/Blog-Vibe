import React, { useEffect, useState } from 'react'
import moment from "moment"

function Comment({comment}) {

    const [user, setUser] = useState({});
    console.log(user);
    

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if(res.ok){
                    setUser(data);
                }
            } catch (error) {
                console.log(error);
                
            }
        }

        getUser();
    }, [comment])
    
  return (
    <div className='flex border-b dark:border-gray-600 text-sm p-4'>
        <div className="flex-shrink-0 mr-3">
            <img src={user.profilePicture} alt="" className='w-10 h-10 rounded-full bg-gray-200' />
        </div>

        <div className="flex-1">
            <div className="flex items-center mb-1">
                <span className="text-xs font-bold mr-1 truncate">{user ? `@${user.username}` : "anonymous user"}</span>
                <span className='text-sm text-gray-500'>
                    {moment(comment.createdAt).fromNow()}
                </span>
            </div>
            <p className='text-gray-500 pb-2'>{comment.content}</p>
        </div>
    </div>
  )
}

export default Comment