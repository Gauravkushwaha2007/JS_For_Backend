// For Each loop 
// Use for interact with each element in array without creating duplicate of losing of data
let arr = [12,23,34,45,56];

arr.forEach((val)=>{
    console.log(val+ " Gaurav");
});





// map* metohd 
// use when need to create a same size of new array
// The new array has same length as the original array
// Value can be changed or kept same
let ans = arr.map((val)=>{
    return val+1;
})
 console.log(ans);





//filter 
// Use when need only filterd element, the size of array may be smaller or not from given array;
let newAns = arr.filter(function(val){
    if(val>25) return val;
})

console.log(newAns);





//find method 
// Use when need only first one matched condition returns only one element 
let users = [
    {'name': 'Gaurav', 'UserId': 1020, 'isLogedIn': true},
    {'name': 'Raj', 'UserId': 1030, 'isLogedIn': true},
    {'name': 'Chinna', 'UserId': 1040, 'isLogedIn': false}
];

let user = users.find((u)=>{
    return u.isLogedIn == false;
})
console.log(user);
