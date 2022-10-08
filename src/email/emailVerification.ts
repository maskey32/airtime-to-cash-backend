export const emailVerification = (token:string):string => {
    const link = `${process.env.BACKEND_URL}/users/verify/${token}`;

    let temp = `
     <div   style="max-width: 700px;
            margin: auto; 
            border: 10px solid #ddd; 
            padding: 50px 20px; 
            font-size: 110%;">
        <h2 
            style="text-align: center; 
            text-transform: uppercase;
            color: teal;">
            Welcome to Airtime to Cash POD G.
        </h2>
        <p>
            Hi there, Follow the link by clicking on the button to verify your email
        </p>
       <a href=${link}
            style="background: crimson; 
            text-decoration: none; 
            color: white;
            padding: 10px 20px; 
            margin: 10px 0;
            display: inline-block;">
            Click here
        </a>
    </div>
      `;
  return temp;
}

export const forgotPasswordVerification = (id:string):string => {
    const link = `${process.env.FRONTEND_URL}/user/reset-password/${id}`;
  
    let temp = `
       <div style="max-width: 700px;
            margin:auto; 
            border: 10px solid #ddd; 
            padding: 50px 20px; 
            font-size: 110%;">
            <h2 
                style="text-align: center; 
                text-transform: uppercase;
                color: teal;">
                Change your password.
            </h2>
            <p>
                Hi there, Follow the link by clicking on the button to change your password.
            </p>
            <a href=${link}
                style="background: crimson; 
                text-decoration: none; 
                color: white;
                padding: 10px 20px; margin: 10px 0;
                display: inline-block;">
                Click here
            </a>
        </div>
        `;
    return temp;
  }