import { fireEvent, render } from '@testing-library/preact';
import { LegalNoticeContainer } from './LegalNoticeContainer';

describe('The LegalNoticeContainer', () => {
  it('displays and hides the privacy notice when clicked', () => {
    const { getByText, queryByText } = render(<LegalNoticeContainer />);
    expect(queryByText('Company and Contact Information')).toBe(null);
    expect(queryByText('Privacy Policy')).toBe(null);

    fireEvent.click(getByText('privacy notice & imprint'));
    expect(getByText('Company and Contact Information')).toBeVisible();
    expect(getByText('Privacy Policy')).toBeVisible();

    fireEvent.click(getByText('privacy notice & imprint'));
    expect(queryByText('Company and Contact Information')).toBe(null);
    expect(queryByText('Privacy Policy')).toBe(null);
  });
});
