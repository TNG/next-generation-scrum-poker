import classes from './PrivacyNotice.module.css';

export const PrivacyNotice = () => (
  <div class={classes.privacyNotice}>
    <h1>No User Tracking</h1>
    <p>
      We value your privacy and limit any user-identifiable information we collect to the absolute
      minimum we need to provide our service. Most notably we do not include external tracking
      providers.
    </p>
    <h1>Processing of Personal Data</h1>
    <p>
      Any information you provide to us may be processed and stored by us for up to 18 hours on a
      server in the European Union. This includes but is not limited to
    </p>
    <ul>
      <li>ID of the current session</li>
      <li>state of the current session</li>
      <li>user names</li>
      <li>user votes</li>
    </ul>
    <h1>Session Privacy</h1>
    <p>
      Sessions are not private—everyone who knows your session ID will be able to join your session.
      Therefore it is your responsibility to keep your session ID confidential.
    </p>
    <p>
      It is not possible to get information about a session without joining that session, though.
    </p>
    <h1>Usage of Amazon Web Services</h1>
    <p>
      We use an AWS API gateway to provide and manage web socket connections. Moreover, we use an
      AWS S3 bucket to serve pages, images and scripts that are downloaded to your browser.
    </p>
    <p>
      Please have a look at the{' '}
      <a
        href="https://aws.amazon.com/privacy/
      "
        target="_blank"
      >
        AWS Privacy Policy
      </a>{' '}
      for more information.
    </p>
  </div>
);
