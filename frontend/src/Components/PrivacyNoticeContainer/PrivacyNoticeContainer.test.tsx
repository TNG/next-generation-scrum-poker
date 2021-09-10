import { render } from '@testing-library/preact';
import { PrivacyNoticeContainer } from './PrivacyNoticeContainer';
import { fireEvent } from '@testing-library/preact';

describe('The PrivacyNoticeContainer', () => {
  it('displays the privacy notice when clicked', () => {
    const { getByText, queryAllByText } = render(<PrivacyNoticeContainer />);
    expect(queryAllByText('Processing of Personal Data')).toHaveLength(0);
    const privacyLink = getByText('privacy');

    fireEvent.click(privacyLink);

    expect(queryAllByText('privacy')).toHaveLength(0);
    getByText('Processing of Personal Data');
  });
});
