/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React from 'react';
import {StyleSheet} from 'react-native';
import {controlMessageEnum} from '../components/ChatContext';
import {BtnTemplate, UidType} from '../../agora-rn-uikit';
import useIsPSTN from '../utils/isPSTNUser';
import useMutePSTN from '../utils/useMutePSTN';
import useSendControlMessage, {
  CONTROL_MESSAGE_TYPE,
} from '../utils/useSendControlMessage';

export interface RemoteAudioMuteProps {
  uid: UidType;
  audio: boolean;
  isHost: boolean;
}
/**
 * Component to mute / unmute remote audio.
 * Sends a control message to another user over RTM if the local user is a host.
 * If the local user is not a host, it simply renders an image
 */
const RemoteAudioMute = (props: RemoteAudioMuteProps) => {
  const {isHost = false} = props;
  const sendCtrlMsgToUid = useSendControlMessage();
  const isPSTN = useIsPSTN();
  const mutePSTN = useMutePSTN();
  return (
    <BtnTemplate
      disabled={!isHost}
      onPress={() => {
        if (isPSTN(props.uid)) {
          try {
            mutePSTN(props.uid);
          } catch (error) {
            console.error('An error occurred while muting the PSTN user.');
          }
        } else {
          sendCtrlMsgToUid(
            CONTROL_MESSAGE_TYPE.controlMessageToUid,
            controlMessageEnum.muteAudio,
            props.uid,
          );
        }
      }}
      style={style.buttonIconMic}
      name={props.audio ? 'mic' : 'micOff'}
    />
  );
};

const style = StyleSheet.create({
  buttonIconMic: {
    width: 25,
    height: 24,
  },
});

export default RemoteAudioMute;