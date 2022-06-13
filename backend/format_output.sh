output=$(terraform output)
for i in "${output[@]}"; 
do 
    echo "$i" | grep _west; 
done
echo region-west
echo --------------------
echo region-east
echo 
for i in "${output[@]}"; 
do 
    echo "$i" | grep -v _west; 
done
