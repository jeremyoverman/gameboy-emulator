import styled from "styled-components";

const StyledPanel = styled.div`
  height: 500px;

  border: 1px solid black;
`;

const StyledPanelHeader = styled.div`
  padding: 8px;
  font-size: 1.2rem;
  border-bottom: 1px solid black;
`;

const StlyedPanelBody = styled.div`
  padding: 8px;
`;

const Panel = ({
  className,
  title,
  children,
}: {
  title: string;
  className?: string,
  children: React.ReactNode
}) => {
  return (
    <StyledPanel className={className}>
      <StyledPanelHeader>
        <span>{title}</span>
      </StyledPanelHeader>
      <StlyedPanelBody>
        {children}
      </StlyedPanelBody>
    </StyledPanel>
  )
}

export default Panel;