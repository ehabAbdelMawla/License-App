import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router';
import Switch from "react-switch";
import swal from "sweetalert"
import {getTokens} from "../../operations"
import Firebase from 'firebase'

import $ from "jquery" 

import {Collapse} from 'react-collapse';
class ProgramDetails extends Component {

    componentDidMount = () => {
        // scroll To Top When Compontn Open
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    trustedUUids = {
        "uuid1": "Admin1",
        "uuid2": "Admin2",
        "uuid3": "Admin3",
    }
    state={
        current:""
    }
    ClientRefs={}
    UuidsRefs={}
    animationTimeOut=undefined
    openOccordionTimeOut=undefined
    

    sendNotification=async(url,action)=>{
        let tokens= await getTokens();
        fetch("https://validation-push-otification.herokuapp.com/pushNotification",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
              },
              body:JSON.stringify({
                tokens,
                payload:{
                    notification:{
                        title:this.props.match.params.softwareName,
                        body:`${url.split("/")[1]} ${action} In ${url.split("/")[0]} By ${this.props.user.email}`,
                        sound: 'default',
                    }
                }
              })
        })
    }

    change = async(url, prevLicence) => {
        Firebase.database().ref().child(`${this.props.match.params.softwareName}/${url}`).update({ 'licence': !prevLicence, 'lastmodified': this.props.user.email }).then(() => { });
      
        this.sendNotification(url,prevLicence?"Closed":"Opend")
      
    }




    deleteInstance = (url) => {
        swal({
            title: "Are you sure?",
            text: "This Instance Will Stop on user device!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    Firebase.database().ref().child(`${this.props.match.params.softwareName}/${url}`).remove().then(() => {
                        this.sendNotification(url,"Deleted")
                    });
                }
            });
    }
   


    search=(e)=>{
        if(e.key === 'Enter'){
            const searchQuery=e.target.value.trim().toLocaleLowerCase();
            let softwareObj = this.props.softwares[this.props.match.params.softwareName];
           
            /* Search Clients Names */
            let targetUuid;
            targetUuid=Object.keys(softwareObj).filter(name=>name.toLocaleLowerCase() == searchQuery)[0];
            if(targetUuid){
                    this.scrollToElementAndAddAntimation(this.ClientRefs[targetUuid])
                    return
            }
          /* Search Clients Names */
          
          targetUuid=Object.values(softwareObj).reduce((a,obj)=>a=[...a,...Object.keys(obj)],[] ).map(uuid=> this.trustedUUids[uuid]? this.trustedUUids[uuid]:uuid ).filter(uuid=>uuid.toLocaleLowerCase()==searchQuery)[0];
            if(targetUuid){
                const targetElement=this.UuidsRefs[targetUuid]
                // Open Parent Occordion 
                //  Scroll To Target UUid And Add Bounce Effect
                this.scrollToElementAndAddAntimation(targetElement)
                   
            }else{
                swal({
                    title: "Not Found",
                   icon:"warning",})
            }
            


        }
    }

    scrollToElementAndAddAntimation=(ref)=>{
        try{ 
            let timeOutOfFading=2000;  
            // const parent=ref.parentNode.parentNode.parentNode.parentNode.parentNode;
            const parent=$(ref).parents()[4];
            
            if(parent&&parent.dataset.instancename && this.state.current!=parent.dataset.instancename){
                this.setState({current:parent.dataset.instancename},()=>{
                    this.openOccordionTimeOut=setTimeout(()=>{
                        this.scrollAction(ref)     
                      },250)
                })
               
            }else{
                this.scrollAction(ref) 
            }
          
            ref.classList.add("highlight")
            this.animationTimeOut=setTimeout(()=>{
              ref.classList.remove("highlight")     
            },timeOutOfFading)
        }
        catch(error){
            console.log("Error in scrollToElementAndAddAntimation : ",error)
        }
    }

    scrollAction = (element)=>{
        element.scrollIntoView({
            block: "center",
            behavior: 'smooth',
            
        });  
    }

    componentWillUnmount=()=>{
            clearTimeout(this.animationTimeOut)
            clearTimeout(this.openOccordionTimeOut)
    }
    render() {

        if (!this.props.user || !this.props.softwares || !this.props.softwares[this.props.match.params.softwareName]) {
            return <Redirect to={'/programs'} />
        }
        let softwareObj = this.props.softwares[this.props.match.params.softwareName];
        return (
            <div className="Programs-Details ">
                <div className="programNameContainer">
                    <h1 className="programName wow fadeInDown">{this.props.match.params.softwareName}</h1>
                </div>
                <div className='searchText_Container'>
                <input type='text' onKeyPress={this.search} placeholder="Search..."/>
                </div>

                <div className="instanceContainer wow fadeInUp">
                    {Object.keys(softwareObj).sort((a, b) => {
                        let sorted_A = Object.keys(softwareObj[a]).sort((instance1, instance2) => (new Date(softwareObj[a][instance1].lastAccess.replace("م", "PM").replace("ص", "AM")) > new Date(softwareObj[a][instance2].lastAccess.replace("م", "PM").replace("ص", "AM"))) ? -1 : 1);
                        let sorted_B = Object.keys(softwareObj[b]).sort((instance1, instance2) => (new Date(softwareObj[b][instance1].lastAccess.replace("م", "PM").replace("ص", "AM")) > new Date(softwareObj[b][instance2].lastAccess.replace("م", "PM").replace("ص", "AM"))) ? -1 : 1);
                        return (new Date(softwareObj[a][sorted_A[0]].lastAccess.replace("م", "PM").replace("ص", "AM")) > new Date(softwareObj[b][sorted_B[0]].lastAccess.replace("م", "PM").replace("ص", "AM"))) ? -1 : 1;
                    }).map(instanceName => {

                        var detailsofInstance = softwareObj[instanceName] ?
                            Object.keys(softwareObj[instanceName])
                                .sort((a, b) =>
                                    (new Date(softwareObj[instanceName][a].lastAccess.replace("م", "PM").replace("ص", "AM")) > new Date(softwareObj[instanceName][b].lastAccess.replace("م", "PM").replace("ص", "AM"))) ? -1 : 1)
                                .map(uuid => {
                                    return (
                                        <div key={uuid} className="uuidBox wow fadeInUp" >
                                            <article className="textContainer">
                                                <p  ref={(el=>{
                                                    if(this.trustedUUids[uuid.trim()]){
                                                        this.UuidsRefs[this.trustedUUids[uuid.trim()]]=el
                                                    }
                                                    else{
                                                        this.UuidsRefs[uuid.trim()]=el
                                                    }
                                                    
                                                    })}>
                                                    {this.trustedUUids[uuid.trim()] ? this.trustedUUids[uuid.trim()] : uuid.trim()}
                                                    </p>
                                                <p><span>last Access </span> {softwareObj[instanceName][uuid]['lastAccess'].replace("م", "PM").replace("ص", "AM")}</p>
                                                {softwareObj[instanceName][uuid]['startDate'] && <p><span> start Access</span> {softwareObj[instanceName][uuid]['startDate']}</p>}
                                            </article>
                                            <article className="ControllerContainer">
                                                <Switch
                                                    checked={softwareObj[instanceName][uuid].hasOwnProperty("licence") ? softwareObj[instanceName][uuid]['licence'] : false}
                                                    onChange={() => { this.change(`${instanceName}/${uuid}`, softwareObj[instanceName][uuid].hasOwnProperty("licence") ? softwareObj[instanceName][uuid]['licence'] : false) }}
                                                    onColor="#ddd"
                                                    onHandleColor="#eed200"
                                                    handleDiameter={30}
                                                    uncheckedIcon={false}
                                                    checkedIcon={false}
                                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                                    height={20}
                                                    width={48}
                                                    className="switch"
                                                />
                                                <button className="deleteIcon" onClick={() => { this.deleteInstance(`${instanceName}/${uuid}`) }}> <i className="fa fa-trash"></i></button>
                                            </article>
                                        </div>

                                    )
                                }) : '';

                        return (
                            <div key={instanceName} data-instancename={instanceName} className="instanceBox">
                            <h4 className="instanceName" 
                            onClick={()=>{this.setState({current:(this.state.current==instanceName?"":instanceName)})}}
                            ref={(el=>{if(!this.ClientRefs[instanceName])this.ClientRefs[instanceName]=el;})}
                            >{instanceName}
                            </h4>
                            <Collapse isOpened={this.state.current==instanceName} checkTimeout="1000"> {detailsofInstance}</Collapse>
                        </div>
                            )
                    })}
                </div>
            </div >
        );
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.currentUser,
        softwares: state.softwares
    }
}
export default connect(mapStateToProps)(ProgramDetails);