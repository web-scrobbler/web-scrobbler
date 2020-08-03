# Remove invalid "export" line
sed -i ':a;N;$!ba;s/export default Util;\n//g' ./src/types/util.d.ts
