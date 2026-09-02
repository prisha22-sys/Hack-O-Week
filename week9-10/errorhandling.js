try{
    let age=-5
    if (age<0){
        throw new Error("Age cannot be negative")
    }
    console.log("Age is valid",age);
} catch (error) {
    console.log("Error:", error.message);
}