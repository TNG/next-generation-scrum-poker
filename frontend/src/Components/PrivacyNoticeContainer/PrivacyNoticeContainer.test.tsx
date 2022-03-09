import { fireEvent, render } from '@testing-library/preact';
import { PrivacyNoticeContainer } from './PrivacyNoticeContainer';

describe('The PrivacyNoticeContainer', () => {
  it('displays and hides the privacy notice when clicked', () => {
    const { getByText, queryByText } = render(<PrivacyNoticeContainer />);
    expect(queryByText('Datenschutzerklärung')).toBe(null);

    fireEvent.click(getByText('privacy notice'));
    expect(getByText('Datenschutzerklärung')).toBeVisible();

    fireEvent.click(getByText('privacy notice'));
    expect(queryByText('Datenschutzerklärung')).toBe(null);
  });
});
