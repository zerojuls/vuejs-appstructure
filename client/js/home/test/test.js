module.exports = {
  template: require("./testT.js"),
  props: {
    open: Function,
    onaccept: Function,
    close: Function
  },
  data: function(){
    return {
      title: "Test",
      value: 0
    };
  },
  computed: {
    square: function(){
      return this.value*this.value;
    }
  },
  methods: {},
  beforeCreate: function(){},
  created: function(){},
  beforeMount: function(){},
  mounted: function(){},
  beforeUpdate: function(){},
  updated: function(){},
  activated: function(){},
  deactivated: function(){},
  beforeDestroy: function(){},
  destroyed: function(){}
};