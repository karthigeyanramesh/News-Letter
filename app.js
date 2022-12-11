const express = require("express");
const bodyParser= require("body-parser")
const request= require("request");

const https = require("https")
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
// *** CSS
// we use the below code to use css for websites.
app.use(express.static("public"));

// remeber for mailchimp go to the Batch subscribe or unsubscribe

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",function(req,res ){
    const firstName= req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    console.log(email,firstName,lastName)
   
    const data= {
        members:[
            {
                email_address: email,
                status:"subscribed",
                // when its a js object must be in curly braces(to identify wether
                // object or not simply see docs)
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
        
    };
    var jsonData=  JSON.stringify(data);
// remeber never forget the https here! and also the list id after /lists
    const url = "https://us17.api.mailchimp.com/3.0/lists/e5c88066fe";
    
    const options = {
        method:"POST",
        auth:"karthy:d55197146ba56fce1500b12874915f6b-us17"
    }


    
    
    const request=  https.request(url,options,function(response){
        
        
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
            

            


        })

        var status =response.statusCode;
            console.log(status);
            if (status==200){
                
                    res.sendFile(__dirname+"/success.html")
                

            }else{
                res.sendFile(__dirname+"/failure.html")
            }

    })
    // the code below takes the stringified data and send it to mailchimp
    request.write(jsonData);
    request.end();

// REMEMBER WE DONT WRITE https.GET HERE AS THE SERVERS ARE NOT LOCAL RATHER USE IT IN 
    // https.get(url, function(response){
    //     var status =response.statusCode;
    //     console.log(status);
    //     if (status==200){
    //         res.write("sucess")
    //         res.send()
    //     }else{
    //         res.send("failiure")
    //     }
        
    // })


    

    
});

app.post("/failure",function(req,res){
    res.redirect("/")
})





// d55197146ba56fce1500b12874915f6b-us17

// e5c88066fe - list key





app.listen(process.env.PORT || 1500,function(){
    console.log("server initiated!");

});


