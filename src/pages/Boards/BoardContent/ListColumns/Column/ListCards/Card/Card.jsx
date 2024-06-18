import { useEffect, useState } from 'react';
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { updateCardAPI } from '~/apis';
import { toast } from 'react-toastify'
import { red } from '@mui/material/colors';
import Column from '../../Column';
function Card({ card, onReload }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState(1);
  const [isSend, setIsSend] = useState(false);
  const [hourNumber, setHourNumber] = useState(null);
  const [cardColor, setCardColor] = useState('');
  const [startDateStr, setStartDateStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');
  const [statusStr, setStatusStr] = useState('');

  useEffect(() => {
    // console.log('card: ', card)
    if (card) {
      setTitle(card.title)
      if (card.startDate) 
        setStartDateStr(dayjs(card.startDate).format('DD/MM/YYYY HH:mm'));
      if (card.endDate) 
        setEndDateStr(dayjs(card.endDate).format('DD/MM/YYYY HH:mm'));
      if (card.status == 1) setStatusStr('Mới')
      else if (card.status == 2) setStatusStr('Đang thực hiện')
      else setStatusStr('Hoàn thành')
      if ( startDate > endDate) {
      
      toast.success(res.message);
      handleClose();
      onReload();
     }
      //Nếu trạng thái là Hoàn thành
      if (card.status == 3) {
        setCardColor('#64bc4c');
      }
      else {
        if (card.endDate) {
          let dateNow = new Date();
          let endDate = new Date(card.endDate);
          
          //Nếu quá hạn hoàn thành
          if (dateNow > endDate)setCardColor('#ff0000')
          
          else setCardColor('#2596be')
        }
        else {
          setCardColor('#2596be')
        }
      }
    }
  }, [card]);

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }

  const shouldShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  //Khi click mở dialog: Hiển thị lại dữ liệu đã lưu
  const handleClickOpen = () => {
    console.log('selected card: ', card)
    setTitle(card.title)
    setDescription(card.description)
    if (card.startDate) setStartDate(dayjs(card.startDate))
    if (card.endDate) setEndDate(dayjs(card.endDate))
    setStatus(card.status)
    setIsSend(card.isSend)
    setHourNumber(card.hourNumber)
    setOpen(true);

  };

  //Đóng dialog
  const handleClose = () => {
    setOpen(false);
  };

  //Lưu form dialog
  const handleSave = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    // console.log('formJson: ', formJson);

    let data = {
      id: card._id,
      title: formJson.title,
      description: formJson.description,
      startDate: dayjs(formJson.startDate, 'DD/MM/YYYY HH:mm').toDate(),
      endDate: dayjs(formJson.endDate, 'DD/MM/YYYY HH:mm').toDate(),
      status: status,
      isSend: isSend,
      hourNumber: hourNumber != '' ? Number(hourNumber) : null,
    }
    if(data.startDate > data.endDate) {
      toast.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return;
    }
    updateCardAPI(data).then((res) => {
    console.log(res)

      if (res && res.messageCode != 200) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      handleClose();
      onReload();
    });
  }

  return (
    <>
      <MuiCard 
        ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          overflow: 'unset',
          display: card?.FE_PlaceholderCard ? 'none' : 'block',
          border: '1px solid transparent',
          '&:hover': { borderColor: (theme) => theme.palette.primary.main },
          background: cardColor,
          // overflow: card?.FE_PlaceholderCard ? 'hidden' : 'unset',
          // height: card?.FE_PlaceholderCard ? '0px' : 'unset'
        }}
        onClick={handleClickOpen}
      >
        {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} /> }
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>{card?.title}</Typography>
          <Typography>{startDateStr + ' - ' + endDateStr}</Typography>
          <Typography>{statusStr}</Typography>
          
        </CardContent>
        {shouldShowCardActions() &&
          <CardActions sx={{ p: '0 4px 8px 4px' }}>
            {!!card?.memberIds?.length &&
              <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>
            }
            {!!card?.comments?.length &&
              <Button size="small" startIcon={<CommentIcon />}>{card?.comments?.length}</Button>
            }
            {!!card?.attachments?.length &&
              <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>
            }
          </CardActions>
        }
      </MuiCard>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm" // Thiết lập chiều rộng tối đa cho Dialog
        fullWidth // Đảm bảo Dialog lấp đầy chiều rộng của parent container
        PaperProps={{
          component: 'form',
          onSubmit: (event) => handleSave(event),
        }}
      >
        <DialogTitle>Chi tiết công việc</DialogTitle>
        <DialogContent>
          <div className='row'>
            <div className='col-md-12'>
              <DialogContentText>
                Tên *
              </DialogContentText>
              <TextField
                autoFocus
                required
                margin="dense"
                id="title"
                name="title"
                label=""
                type="text"
                fullWidth
                variant="outlined"
                defaultValue={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                }}
              />
            </div>
          </div>

          <div className='row mt-3'>
            <div className='col-md-12'>
              <DialogContentText>
                Nội dung *
              </DialogContentText>
              <TextField
                required
                margin="dense"
                id="description"
                name="description"
                label=""
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                defaultValue={description}
              />
            </div>
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='row mt-3'>
              <div className='col-md-6'>
                <DialogContentText>
                  Bắt đầu
                </DialogContentText>
                <DateTimePicker 
                  id="startDate"
                  name="startDate"
                  disableOpenPicker={false}
                  format="DD/MM/YYYY HH:mm"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue)
                  }}
                />
              </div>
              <div className='col-md-6'>
                <DialogContentText>
                  Hoàn thành
                </DialogContentText>
                <DateTimePicker 
                  id="endDate"
                  name="endDate"
                  disableOpenPicker={false}
                  format="DD/MM/YYYY HH:mm"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                />
              </div>
            </div>
          </LocalizationProvider>

          <div className='row mt-3'>
            <div className='col-md-6'>
              <DialogContentText>
                Trạng thái *
              </DialogContentText>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="status"
                  name="status"
                  value={status}
                  label=""
                  onChange={(e) => {
                    setStatus(e.target.value)
                  }}
                >
                  <MenuItem value={1}>Mới</MenuItem>
                  <MenuItem value={2}>Đang thực hiện</MenuItem>
                  <MenuItem value={3}>Hoàn thành</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className='col-md-6'>
              <DialogContentText>
                Thêm Thành Viên 
              </DialogContentText>
              <TextField
                id= ""
                label=""
                fullWidth
                
              />
            </div>
          </div>



          <div className='row mt-3'>
            <div className='col-md-7'>
              <FormGroup>
                <FormControlLabel 
                  control={<Checkbox
                    id="isSend"
                    name="isSend"
                    checked={isSend}
                    onChange={(event) => {
                      setIsSend(event.target.checked)
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />} 
                  label="Gửi email cảnh báo khi sắp đến hạn" 
                />
              </FormGroup>
            </div>
            <div className='col-md-5'>
              <DialogContentText>
                Trước (giờ)
              </DialogContentText>
              <div style={{width: '120px'}}>
                <TextField 
                  id="hourNumber"
                  name="hourNumber"
                  fullWidth
                  inputProps={{ type: 'number'}} 
                  defaultValue={hourNumber}
                  onChange={(e) => {
                    setHourNumber(e.target.value)
                  }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
          <Button type="submit">Lưu</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Card