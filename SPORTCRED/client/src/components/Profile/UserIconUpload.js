import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import {Typography} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {CloudUpload} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import UserIcon from "./UserIcon";
import {setUserProfile} from "../../backendConnector/profile";


const UserIconUpload = (props) => {

    const [uploading, setUploading] = React.useState(false);
    const [image, setImage] = React.useState({url:'',formData:new FormData()});

    const readURL = file => {
        return new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload = e => res(e.target.result);
            reader.onerror = e => rej(e);
            reader.readAsDataURL(file);
        });
    };
    const preview = async (file) => {
        const formData = new FormData()

        formData.append('file',file);
        formData.append("upload_preset","t42pg7vu");
        setImage({url: (await readURL(file)),formData: formData});
        setUploading(false);
    };

    const onChange = (e) => {
        const files = Array.from(e.target.files)
        setUploading(true);

        preview(files[0]);
    }

    const display = () => {
        if (uploading) {
            return <p>uploading...</p>
        } else if (image.url !== undefined && image.url.localeCompare('') !== 0) {
            return <Container>
                <label htmlFor='uploadImg'>
                    <UserIcon size="xlarge" fullName="" imgSrc={image.url}/>
                </label>
                <input type='file' id='uploadImg' onChange={onChange} style={{display: 'none'}}/>
            </Container>
        } else {
            return <span>
                <label htmlFor='uploadImg'>
                    <IconButton style={{'outline': 'none'}} component="span">
                        <CloudUpload style={{width: '200px', height: '200px'}}/>
                    </IconButton>
                </label>
                <input type='file' id='uploadImg' onChange={onChange} style={{display: 'none'}}/>
            </span>
        }

    }

    const cancel = () => {
        props.close();
        setImage({url:'',formData: new FormData()});
    }

    const save = async () => {
        props.close();
        if (await setUserProfile({userIcon: image.formData},props.username ,'iconUpload')){
            props.setImgSrc(image.url);
            setImage({url: '', formData: new FormData()});
        } else {
            setImage({url:'',formData: new FormData()});
        }
    }

    return (<Dialog open={props.open} onClose={props.close} fullWidth="true" maxWidth="sm">
        <DialogTitle><Typography variant="h1" component="h1" color="secondary">Upload New Profile
            Picture</Typography></DialogTitle>
        <DialogContent>
            <DialogContentText style={{textAlign: 'center'}}>
                {display()}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={cancel} color="secondary" style={{outline: 'none'}}>
                <b> Cancel</b>
            </Button>
            <Button onClick={save} color="secondary" style={{outline: 'none'}}>
                <b> Save</b>
            </Button>
        </DialogActions>
    </Dialog>)
}

export default UserIconUpload;