import React from 'react';
// import './Cards.css';

const Cards= ({ title, description, image ,order}) => {
  return (
    <div className="card  mb-3" style={{ maxWidth: '100%',height:"400px" }}>
    <div className="row h-100 d-flex flex-wrap m-2 g-2">
      <div className={`col-6 order-${order}`}>
        <img src={image} className="img-fluid rounded-start object-fit" alt="..." style={{width:"300px"}}/>
      </div>
      <div className="col-6 d-flex justify-content-center align-items-center" >
        <div className="card-body ">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
        </div>
      </div>
    </div>
  </div>
  );
};


export default Cards;