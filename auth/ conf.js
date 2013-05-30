module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'dev':
            return 'dev_dev({object})';
            break;

        case 'prod':
            return 'proed_prod (object{})';
            break;

        default:
            return 'dev_dev({object})'; 
            break;
    }
};