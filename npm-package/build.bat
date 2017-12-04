echo off
echo 'Starting Typescript transpile'
call tsc -p .
echo 'Finished Typescript transpile'
echo 'Deleting old .scss files'
del .\*.scss
echo 'Copying source .scss files'
copy ..\flexiboard-ionic\src\components\flexiboard\*.scss .\