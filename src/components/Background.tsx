import '../styles/Background.scss';
import { dataType } from '../types/types';

type props = {
  data: dataType;
}

export default function Background({
  data
}: props) {
  return (
    <div className={"Background " + data.status} />
  );
}