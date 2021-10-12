reg1 = {
    nome: "Diogo1"
  };

reg2 = {
    nome: "Diogo2"
  };

reg3 = {
    nome: "Diogo3"
  };

regs = [];

regs.push(reg1);
regs.push(reg2);
regs.push(reg3);

for(let reg in regs){
    console.log(regs[reg].nome);
}