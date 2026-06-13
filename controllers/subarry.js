let arr = [1,2,3,4,5];

for(let i = 0; i< arr.length; i++){
    
    console.log(arr[i]);
    for(let j =i+1; j<arr.length; j++){
        for(let k =i; i<j; k++){

            console.log(arr[i]);
        }
        console.log( " ");
        
    }
}