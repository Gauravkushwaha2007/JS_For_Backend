// For Each loop 
// Use for interact with each element in array without creating duplicate of losing of data
let arr = [12,23,34,45,56];

arr.forEach((val)=>{
    console.log(val+ " Gaurav");
});





// map* metohd 
// use where we need to create a same size of new array with value(can be differe or same)
let ans = arr.map((val)=>{
    return val+1;
})
 console.log(ans);





//filter 
//use where we want a new array but with filtered value, but array size will not be same, where map method returns same size of array
let newAns = arr.filter(function(val){
    if(val>25) return val;
})

console.log(newAns);