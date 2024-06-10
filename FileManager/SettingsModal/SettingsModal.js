import React, { useState, useEffect } from 'react';
import { Modal, Button, Checkbox, Icon, Form, Input, Label, Dimmer, Loader } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import api from '../api/storage';

const SettingsModal = ({ open, closeModal }) => {
  // const [saving, setSaving] = useState(false)
  // const [error, setError] = useState(false)

  const [settings, setSettings] = useState({});

  const [notLoaded, setNotLoaded] = useState(true);

  useEffect(() => {
    if (!open) return;
    setNotLoaded(true);
    api.getSettings().then((s) => {
      // Default settings:
      setSettings({
        ...s,
        useSettings: true, // Indicated that these aren't just the default settings
      });
      setNotLoaded(false);
    });
  }, [open]);

  const saveSettings = () => {
    // setSaving(true)
    // setError(false)
    api
      .saveSettings(settings)
      .then(() => toast('⚙️ Settings saved'))
      .catch((err) => toast(`❌ An error occurred and we couldn't save your settings`));
  };

  const close = () => {
    saveSettings();
    closeModal();
  };

  return (
    <div>
      <Modal open={open} onClose={close} size="large" centered={false} dimmer="inverted">
        <Modal.Header>Options & Settings</Modal.Header>
        <Modal.Content>
          <Dimmer active={notLoaded} inverted>
            <Loader size="large">Loading...</Loader>
          </Dimmer>

          <Modal.Description style={{ marginBottom: '15px' }}>Your settings will be saved in a file in your storage bucket.</Modal.Description>
          <Form>
            <Form.Field>
              <label>Default File Privacy</label>
              <Checkbox
                toggle
                label={`Uploaded files are ${settings.defaultPublicFiles ? 'public' : 'private'} by default`}
                checked={settings.defaultPublicFiles}
                onClick={() => setSettings({ ...settings, defaultPublicFiles: !settings.defaultPublicFiles })}
              />
            </Form.Field>
            <Form.Field>
              <label>Private URL Expiration</label>
              <p>Shared links for private files will expire after</p>
              <Form.Input type="number" labelPosition="right" inline onChange={(e) => setSettings({ ...settings, privateUrlExpiration: e.currentTarget.value })}>
                <input value={settings.privateUrlExpiration} />
                <Label>days</Label>
              </Form.Input>
            </Form.Field>
            <Form.Field>
              <label>CDN Admins</label>
              <p>
                Every email you add to this comma-separated list <strong>(no spaces)</strong> will have <strong>full read and write access to the storage bucket</strong> and settings. They will be
                able to sign into this dashboard with their Google account.
              </p>
              <Input onChange={(e) => setSettings({ ...settings, cdnAdmins: e.currentTarget.value })}>
                <input value={settings.cdnAdmins} />
              </Input>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {/*<p style={{color: error ? 'red' : 'green', fontWeight: 'bold'}}>*/}
          {/*  {!saving && <Icon name='check'/>}*/}
          {/*  { error ? `An error occurred.` : saving ? 'Saving your settings....' : 'Settings saved' }*/}
          {/*</p>*/}
          <Button onClick={close}>Save</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default SettingsModal;
