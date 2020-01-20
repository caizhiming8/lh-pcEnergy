var storage = {
    get: function(key) {
        return JSON.parse(localStorage.getItem(key));
    },
    set: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: function(key) {
        localStorage.removeItem(key);
    },
    unique: function(arr,mark) {
        var res=[arr[0]];
        for(var i=1;i<arr.length;i++){
            var repeat=false;
            for(var j=0;j<res.length;j++){
                if(typeof(mark)=='undefined'){
                    if(arr[i]==res[j]){
                        repeat=true;
                        break;
                    }
                }else{
                    if(arr[i][mark]==res[j][mark]){
                        repeat=true;
                        break;
                    }
                }

            }
            if(!repeat){
                res.push(arr[i]);
            }
        }
        return res
    }
};

export default storage;
