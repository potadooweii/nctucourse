import React from 'react'
import { Container, Paper, Table, TableContainer, TableRow, TableCell, Chip, TableHead, TableBody, Button, TablePagination, InputBase, Typography, Link } from '@material-ui/core'
import SearchBar from '../../../Components/SearchBar'
import axios from 'axios'
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { Feedback } from './single'

class FeedbackList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            page: 0,
            rows: [],
            count: [],
            my: Boolean(new URLSearchParams(window.location.search).get('my'))
        }
        this.updateContent = this.updateContent.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }

    componentDidMount() {
        this.updateContent()
    }

    async updateContent() {
        const query = new URLSearchParams(window.location.search);
        const search = query.get('search') || ''
        const page = parseInt(query.get('page')) || 1
        const url = this.state.my ? '/api/courses/feedbacks/my/' : '/api/courses/feedbacks/'
        let res = await axios.get(`${url}?limit=${10}&offset=${10 * (page - 1)}&search=${search}`)
        this.setState({
            search: search,
            page: page,
            rows: res.data.results,
            count: res.data.count,
        })
    }

    async handleSearch() {
        window.location.href = this.makePageUrl(1)
    }

    makePageUrl(i) {
        if (this.state.my)
            return `/feedbacks?my=true&page=${i}&search=${this.state.search}`
        else
            return `/feedbacks?page=${i}&search=${this.state.search}`
    }

    makeCourseName(course) {
        return `${course.cos_id} ${course.cname}（${course.teacher_name}）`
    }

    makeFeedbackUrl(feedback) {
        if (this.state.my) {
            return `/feedbacks/edit/${feedback.id}`
        }
        else {
            return `/feedbacks/${feedback.id}`
        }
    }

    render() {
        const { page, count, rows, search, my } = this.state
        return (
            <Container>                
                <Typography variant="h4" gutterBottom >心得</Typography>
                <div style={{ marginBottom: 20 }}>
                    <Button variant="contained" color="primary" href="/feedbacks/edit">
                        新增心得
                    </Button>
                    <Button variant="contained" color="secondary" style={{ marginLeft: 5 }}
                        href={my ? '/feedbacks' : '/feedbacks?my=true'}
                    >
                        {my ? '所有文章' : '我的文章'}
                    </Button>
                </div>
                <SearchBar style={{ marginBottom: 20 }} value={search}
                    onChange={e => this.setState({ 'search': e.target.value })} onSearch={this.handleSearch} />
                <Paper>
                    <TableContainer className="table-responsive" >
                        <Table aria-label="simple table" style={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>學期</TableCell>
                                    <TableCell>課程</TableCell>
                                    <TableCell>標題</TableCell>
                                    <TableCell align="right">作者</TableCell>
                                    <TableCell align="right">更新時間</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.id} hover
                                        style={{ cursor: "pointer" }}
                                        onClick={() => { window.location.href = this.makeFeedbackUrl(row) }}>
                                        <TableCell component="th" scope="row">
                                            {row.course.sem_name}
                                        </TableCell>
                                        <TableCell> {this.makeCourseName(row.course)}</TableCell>
                                        <TableCell>
                                            <Link href={this.makeFeedbackUrl(row)} underline="none" color="textPrimary">
                                                {row.title}
                                                {(my && row.draft) && <Chip size="small" label="草稿" style={{ marginLeft: 5 }} />}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right">{row.owner}</TableCell>
                                        <TableCell align="right">{row.updated_at}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{ width: 'fit-content', margin: '0 auto', padding: '10px 0' }}>
                        <Pagination
                            page={page}
                            count={Math.ceil(count / 10)}
                            renderItem={(item) => (
                                <PaginationItem
                                    component={Link}
                                    href={this.makePageUrl(item.page)}
                                    {...item}
                                />
                            )}
                        />
                    </div>
                </Paper>
                {rows.length > 0 && <Feedback feedback={rows[0]} />}
            </Container >
        )
    }
}

export default FeedbackList