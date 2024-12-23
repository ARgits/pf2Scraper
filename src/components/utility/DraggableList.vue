<script setup lang="ts">
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useTemplateRef, watch } from 'vue';
const shadow1 = "0 1px 3px  0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.6)";
const shadow2 = "0 6px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 2px 0 rgba(0, 0, 0, 0.2)";
const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
const duration =.2
const {values}=defineProps<{values:string[]}>()
const elems = useTemplateRef<HTMLDivElement[]>('columns')
const arr:HTMLDivElement[]=[]


watch(elems, ()=>{
  
  arr.splice(0,arr.length, ...gsap.utils.toArray<HTMLDivElement>(elems.value))
  
  gsap.to(arr,{
    duration,
    y:function(index){
      
      return 3*rem*index
    }
  })
  Draggable.create(arr,{
    bounds:arr[0].parentElement,
    type:'y',
    onDrag,
    onPress,
    onRelease,
    liveSnap:function(value) {
      return Math.round(value/(3*rem))*3*rem
    },
  })
})
function onPress(this:Draggable){
  gsap.to(this.target,{
    boxShadow:shadow1,
    duration
  })
}
function onRelease(this:Draggable){
  gsap.to(this.target,{
    boxShadow:'none',
    duration
  })
}

function onDrag(this:Draggable){
  const otherColumns = arr.filter(v=>!v.isEqualNode(this.target))
  if(this.deltaY!==0){
    
    for(const elem of otherColumns){
      if(this.hitTest(elem,"50%")){
        const direction = Math.sign(this.y-this.startY)
        const defaultTransofrm = 'translate3d(0px, 0px, 0px)'
        const elemTransform = gsap.getProperty(elem,'transform')
        
        if(direction>0){
          this.target.parentElement!.insertBefore(elem,this.target)
        }else{
          this.target.parentElement!.insertBefore(this.target,elem)
        }
        gsap.to(elem,{
          boxShadow:shadow2,
          duration,
        })
        break
      }
    }
    // 
    gsap.to(this.target.parentElement!.children,{
      boxShadow:(index,target)=>{
        if(this.target.isEqualNode(target)){
          return this.target.style.boxShadow
        }
        return 'none'
      },
      duration,
      y:(index,target)=>{
        
        if(this.target.isEqualNode(target)){
          return this.y
        }
        
        return 3*rem*index
      }
    })}
}
</script>
<template>
  <div
    v-for="(val,ind) in values"
    ref="columns"
    :key="val+ind"
    class="draggable"
    :data-val="val"
  >
    {{ val }}
  </div>
</template>
<style lang="scss">
.draggable{
  position: absolute;
  user-select: none;
      border:1px solid black;
      padding: 5px;
      width: 100%;
      box-sizing: border-box;
}
</style>