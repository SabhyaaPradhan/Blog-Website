import React from "react";
import { Button } from "react-bootstrap";

function LikeButton({ handleLike }) {
  return (
    <div className="like-button-container">
      <Button variant="outline-success" onClick={handleLike}>
        Like
      </Button>
    </div>
  );
}

export default LikeButton;
