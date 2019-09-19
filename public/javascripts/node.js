let Node = function(nodeTemplate){
  this.name = nodeTemplate.name;
  this.type = nodeTemplate.type;
  this.requirements = {
    credits: nodeTemplate.requirements.credits,
    favors: nodeTemplate.requirements.favors,
    secrets: nodeTemplate.requirements.secrets,
    programs: nodeTemplate.requirements.programs
  };
  this.reward = {
    type: nodeTemplate.requirements.type,
    amount: nodeTemplate.requirements.amount
  }
  currentHacker = null;
  integrity = nodeTemplate.requirements.integrity;
}


let nodeTemplates = {
  carwash: {
    name: "Billy Jeans Carwash",
    type: "normal",
    requirements:
      {
        credits: 20,
        favors: 0,
        secrets: 0,
        programs: 0
      },
    reward: {
      type: "credits",
      amount: 20
    },
    currentHacker: null,
    integrity: 5 //ticks til node breaks
  },


}
