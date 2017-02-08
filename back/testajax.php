<!DOCTYPE HTML>
<html>

<head>
    <script src="js/jquery-3.1.0.min.js"></script>
    <style>
        #panel, #flip {
            padding: 5px;
            text-align: center;
            background-color: #e5eecc;
            border: solid 1px #c3c3c3;
        }

        #panel {
            padding: 50px;
            display: none;
        }
    </style>
</head>

<body>
    
    <input type="text" id="text1" value="AAA" />
    <button id="getButton">GET RQST</button>
    <script>
       $(document).ready(function(){
          $("#getButton").click(function(){
            var ar1 = document.getElementById("text1").value;
             $.ajax({     
              method: "POST",                                 
              url: 'demo_testp.php',                  
              data: "no1="+ar1+"&no2=12",                       
              dataType: 'json',                //data format      
              success: function(data)          //on recieve of reply
              {
                console.log(data);
              } 
            });


        
          }); 
       });
    </script>
</body>

</html>