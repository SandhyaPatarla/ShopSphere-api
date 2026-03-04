const subsetsWithDup = function(nums) {
    let ans=[]
    let n=nums.length
    function rec(ind,ds){
        if(ind>=n){
             ans.push([...ds])
             return }
        ds.push(nums[ind])
        rec(ind+1,ds)
        ds.pop()
        rec(ind+1,ds)
    }
    rec(0,[])
    return ans
};

console.log(subsetsWithDup([1,2,3]))