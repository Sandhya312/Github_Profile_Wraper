console.log("connected");

const userForm = document.getElementById('user_form');
let alertMsg = document.getElementById('alert');
let user_name = document.getElementById('user_name');
// // form submission

userForm.addEventListener('submit',async (e)=>{
    try{
        e.preventDefault();
        let formData = new FormData(e.target);
        let userName = formData.get('user_name');
        
         await fetch(`https://api.github.com/users/${userName}`)
        .then((response)=>{
            if(response.ok){
                return response.json();
            }else {
                throw new Error("Not Found")
            }
        })
        .then(data=>{
            localStorage.setItem('user_name',userName);
            user_name.value='';
         window.location.href='./user.html';
        alertMsg.classList.add('d-node');
        })
    }
    catch(err){
     alertMsg.classList.remove('d-none');
     user_name.value='';
        console.log(err);
    }

})
