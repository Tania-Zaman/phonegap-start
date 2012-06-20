<?php

$x;
foreach ($_FILES as $key => $value)
{
echo $key;
 foreach ($value as $k=>$v)
 {
 	if ($k=='tmp_name')
 		$x=$v;
 }
}

echo $x;
echo "hello";
move_uploaded_file($x, 'test.mov');
?>