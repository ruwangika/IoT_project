<?php  
    class circularArray{
        public $arr=array();
        public function init($data){
            foreach($data as $key=>$value){
                $temp=array("key"=>$key,"count"=>0);
                array_push($this->arr,$temp);
            }
        }
        public function &getArray(){
            return $this->arr;
        }
        public function &getFirst(){
            return $this->arr[0];
        }
        public function pushBack(){
            array_push($this->arr, array_shift($this->arr));
        }
        
    }
?>