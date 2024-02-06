import React, { useState } from "react";
import { Button } from "react-bootstrap";

function LikeButton() {
   const [likes, setLikes] = useState(0);
   const [liked, setLiked] = useState(false);
   return (
      <div className="like-button-container">
         <Button variant="outline-success"
            className={`like-button ${liked ? 'liked' : ''}`}
            onClick={() => {
               setLikes(likes + 1);
               setLiked(true);
            }}
         >
            {likes} Likes
         </Button>
      </div>
   );
}
export default LikeButton;